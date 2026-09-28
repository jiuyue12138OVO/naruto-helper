# -*- coding: utf-8 -*-
"""
圆形区域截图工具（多位置版）
- 全局快捷键触发
- 拖动圆心移动 / 拖动圆弧缩放 / 滚轮微调
- 支持多个位置（配置），Tab / ←→ 切换，数字 1-9 快速跳转
- N 键把当前圆存为新位置
- 自动保存到脚本同目录的 circle_shot_config.json
"""

import os
import sys
import json
import datetime

try:
    from PyQt5 import QtCore, QtGui, QtWidgets
except ImportError:
    print("缺少 PyQt5: pip install PyQt5")
    sys.exit(1)

try:
    import keyboard
except ImportError:
    print("缺少 keyboard: pip install keyboard")
    sys.exit(1)


# ================== 配置区 ==================
HOTKEY = "ctrl+alt+o"
EXIT_HOTKEY = "ctrl+alt+q"
SAVE_DIR = r"C:\Users\jiuyu\Pictures\Screenshots"
COPY_TO_CLIPBOARD = True

# 配置文件放在脚本同目录，方便管理
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(SCRIPT_DIR, "circle_shot_config.json")
# ===========================================


def load_cfg():
    """加载配置。兼容旧的单圆格式 {cx, cy, r}。"""
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            d = json.load(f)
    except Exception:
        return None

    if not isinstance(d, dict):
        return None

    # 新格式 {current, circles:[...]}
    if "circles" in d and isinstance(d["circles"], list):
        circles = []
        for c in d["circles"]:
            if isinstance(c, dict) and all(k in c for k in ("cx", "cy", "r")):
                circles.append({
                    "name": str(c.get("name", f"位置{len(circles) + 1}")),
                    "cx": float(c["cx"]),
                    "cy": float(c["cy"]),
                    "r": float(c["r"]),
                })
        if circles:
            cur = int(d.get("current", 0))
            cur = max(0, min(cur, len(circles) - 1))
            return {"current": cur, "circles": circles}
        return None

    # 旧格式 {cx, cy, r}
    if all(k in d for k in ("cx", "cy", "r")):
        return {"current": 0, "circles": [
            {"name": "位置1", "cx": float(d["cx"]),
             "cy": float(d["cy"]), "r": float(d["r"])}
        ]}
    return None


def save_cfg(data):
    try:
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as ex:
        print("[警告] 保存配置失败:", ex)


def grab_virtual_desktop():
    screens = QtWidgets.QApplication.screens()
    if not screens:
        raise RuntimeError("没有检测到屏幕")
    vg = QtCore.QRect()
    for s in screens:
        vg = vg.united(s.geometry())
    dpr = screens[0].devicePixelRatio()
    canvas = QtGui.QPixmap(int(round(vg.width() * dpr)),
                           int(round(vg.height() * dpr)))
    canvas.setDevicePixelRatio(dpr)
    canvas.fill(QtCore.Qt.black)
    p = QtGui.QPainter(canvas)
    for s in screens:
        pm = s.grabWindow(0)
        g = s.geometry()
        p.drawPixmap(QtCore.QRect(g.x() - vg.x(), g.y() - vg.y(),
                                  g.width(), g.height()), pm)
    p.end()
    return canvas, vg


def crop_circle(bg, vg, cx_global, cy_global, radius):
    dpr = bg.devicePixelRatio()
    lx = (cx_global - vg.x()) * dpr
    ly = (cy_global - vg.y()) * dpr
    r = radius * dpr
    size = int(round(r * 2))
    if size < 4:
        return None
    src = bg.toImage()
    out = QtGui.QImage(size, size, QtGui.QImage.Format_ARGB32)
    out.fill(QtCore.Qt.transparent)
    p = QtGui.QPainter(out)
    p.setRenderHint(QtGui.QPainter.Antialiasing, True)
    path = QtGui.QPainterPath()
    path.addEllipse(QtCore.QRectF(0, 0, size, size))
    p.setClipPath(path)
    p.drawImage(QtCore.QRectF(0, 0, size, size),
                src,
                QtCore.QRectF(lx - r, ly - r, r * 2, r * 2))
    p.end()
    return out


class CircleOverlay(QtWidgets.QWidget):
    captured = QtCore.pyqtSignal(QtGui.QImage)
    cancelled = QtCore.pyqtSignal()

    CENTER_HANDLE_R = 12
    EDGE_TOLERANCE = 10
    MIN_RADIUS = 8

    def __init__(self, bg, vg, cfg):
        super().__init__(None,
                         QtCore.Qt.FramelessWindowHint |
                         QtCore.Qt.WindowStaysOnTopHint |
                         QtCore.Qt.Tool)
        self.setAttribute(QtCore.Qt.WA_DeleteOnClose, True)
        self.bg = bg
        self.vg = vg
        self.setGeometry(vg)
        self.setMouseTracking(True)
        self.setCursor(QtCore.Qt.CrossCursor)

        self.circles = list(cfg["circles"]) if cfg and cfg.get("circles") else []
        self.idx = int(cfg["current"]) if cfg else 0

        # 如果没有任何配置，创建一个默认圆（屏幕中心，半径 200）
        if not self.circles:
            self.circles = [{
                "name": "位置1",
                "cx": float(vg.center().x()),
                "cy": float(vg.center().y()),
                "r": 200.0,
            }]
            self.idx = 0

        self.idx = max(0, min(self.idx, len(self.circles) - 1))

        self.center = QtCore.QPointF(0, 0)
        self.radius = 0.0
        self.active = False
        self.mode = None
        self.drag_offset = QtCore.QPointF(0, 0)

        self._load_current()

    # ---------------- 配置相关 ----------------
    def _load_current(self):
        c = self.circles[self.idx]
        self.center = QtCore.QPointF(c["cx"] - self.vg.x(),
                                     c["cy"] - self.vg.y())
        self.radius = float(c["r"])
        self.active = True

    def _sync_current(self):
        """把当前的圆心/半径写回 circles[idx]"""
        if 0 <= self.idx < len(self.circles) and self.active and self.radius > 0:
            self.circles[self.idx]["cx"] = self.center.x() + self.vg.x()
            self.circles[self.idx]["cy"] = self.center.y() + self.vg.y()
            self.circles[self.idx]["r"] = float(self.radius)

    def _switch(self, new_idx):
        if not self.circles:
            return
        self._sync_current()
        n = len(self.circles)
        self.idx = new_idx % n
        self._load_current()
        self.update()

    def _next(self):
        self._switch(self.idx + 1)

    def _prev(self):
        self._switch(self.idx - 1)

    def _add_new(self):
        """把当前圆存为一个新的位置"""
        if not (self.active and self.radius > 0):
            return
        self._sync_current()
        self.circles.append({
            "name": f"位置{len(self.circles) + 1}",
            "cx": self.center.x() + self.vg.x(),
            "cy": self.center.y() + self.vg.y(),
            "r": float(self.radius),
        })
        self.idx = len(self.circles) - 1
        save_cfg({"current": self.idx, "circles": self.circles})
        self.update()

    # ---------------- 绘制 ----------------
    def paintEvent(self, _event):
        p = QtGui.QPainter(self)
        p.setRenderHint(QtGui.QPainter.Antialiasing, True)
        p.drawPixmap(0, 0, self.bg)

        path = QtGui.QPainterPath()
        path.addRect(QtCore.QRectF(self.rect()))
        if self.active and self.radius > 0:
            path.addEllipse(self.center, self.radius, self.radius)
            path.setFillRule(QtCore.Qt.OddEvenFill)
        p.fillPath(path, QtGui.QColor(0, 0, 0, 150))

        if self.active and self.radius > 0:
            # 圆边框
            p.setPen(QtGui.QPen(QtGui.QColor(0, 170, 255), 2))
            p.setBrush(QtCore.Qt.NoBrush)
            p.drawEllipse(self.center, self.radius, self.radius)

            # 圆心手柄
            p.setPen(QtCore.Qt.NoPen)
            p.setBrush(QtGui.QColor(0, 170, 255, 220))
            p.drawEllipse(self.center, self.CENTER_HANDLE_R, self.CENTER_HANDLE_R)
            p.setPen(QtGui.QPen(QtCore.Qt.white, 2))
            r = self.CENTER_HANDLE_R * 0.55
            c = self.center
            p.drawLine(QtCore.QPointF(c.x() - r, c.y()),
                       QtCore.QPointF(c.x() + r, c.y()))
            p.drawLine(QtCore.QPointF(c.x(), c.y() - r),
                       QtCore.QPointF(c.x(), c.y() + r))

            # 圆旁边的信息标签
            p.setPen(QtGui.QColor(255, 255, 255, 240))
            p.setFont(QtGui.QFont("Microsoft YaHei", 10))
            gcx = int(c.x() + self.vg.x())
            gcy = int(c.y() + self.vg.y())
            name = self.circles[self.idx]["name"] if self.circles else ""
            info = f"[{self.idx + 1}/{len(self.circles)}] {name}  " \
                   f"r={int(self.radius)}  ({gcx}, {gcy})"
            fm = QtGui.QFontMetrics(p.font())
            w = fm.horizontalAdvance(info) + 10
            tx = c.x() + self.radius + 10
            ty = c.y()
            if tx + w > self.width():
                tx = c.x() - self.radius - w - 10
            ty = max(20, min(ty, self.height() - 10))
            p.setPen(QtCore.Qt.NoPen)
            p.setBrush(QtGui.QColor(0, 0, 0, 130))
            p.drawRoundedRect(QtCore.QRectF(tx - 4,
                                            ty - fm.ascent() - 3,
                                            w + 4, fm.height() + 5),
                              4, 4)
            p.setPen(QtGui.QColor(255, 255, 255, 240))
            p.drawText(int(tx), int(ty), info)

        # 顶部操作提示
        p.setPen(QtGui.QColor(255, 255, 255, 230))
        p.setFont(QtGui.QFont("Microsoft YaHei", 11))
        p.drawText(24, 42,
                   "拖动圆心移动 | 拖动圆弧缩放 | 滚轮微调 | 圆外拖动重画 | "
                   "Tab/←→ 切换位置 | 1-9 跳转 | N 存为新位置 | "
                   "Enter/双击 确认 | Esc 取消")

        # 底部位置列表
        if self.circles:
            y = self.height() - 30
            x = 24
            p.setFont(QtGui.QFont("Microsoft YaHei", 10))
            fm = QtGui.QFontMetrics(p.font())
            for i, c in enumerate(self.circles):
                label = f"{i + 1}.{c['name']}"
                w = fm.horizontalAdvance(label) + 16
                if x + w > self.width() - 20:
                    break
                if i == self.idx:
                    p.setPen(QtCore.Qt.NoPen)
                    p.setBrush(QtGui.QColor(0, 170, 255, 200))
                    p.drawRoundedRect(QtCore.QRectF(x,
                                                    y - fm.ascent() - 4,
                                                    w, fm.height() + 6),
                                      4, 4)
                    p.setPen(QtGui.QColor(255, 255, 255))
                else:
                    p.setPen(QtGui.QColor(220, 220, 220, 200))
                p.drawText(int(x + 8), int(y), label)
                x += w + 8

    # ---------------- 命中检测 ----------------
    def _hit_test(self, pos):
        if not (self.active and self.radius > 0):
            return "new"
        d = QtCore.QLineF(self.center, QtCore.QPointF(pos)).length()
        if d <= self.CENTER_HANDLE_R:
            return "move"
        if abs(d - self.radius) <= self.EDGE_TOLERANCE:
            return "resize"
        if d < self.radius:
            return "move"
        return "new"

    def _update_cursor(self, mode):
        if mode == "move":
            self.setCursor(QtCore.Qt.SizeAllCursor)
        elif mode == "resize":
            self.setCursor(QtCore.Qt.SizeHorCursor)
        else:
            self.setCursor(QtCore.Qt.CrossCursor)

    # ---------------- 鼠标 ----------------
    def mousePressEvent(self, e):
        if e.button() != QtCore.Qt.LeftButton:
            return
        pos = e.pos()
        mode = self._hit_test(pos)
        self.mode = mode
        if mode == "new":
            self.center = QtCore.QPointF(pos)
            self.radius = 0.0
            self.active = True
        elif mode == "move":
            self.drag_offset = QtCore.QPointF(pos) - self.center
        self.update()

    def mouseMoveEvent(self, e):
        if not (e.buttons() & QtCore.Qt.LeftButton):
            self._update_cursor(self._hit_test(e.pos()))
            return
        if self.mode == "new":
            self.radius = max(self.MIN_RADIUS,
                              QtCore.QLineF(self.center,
                                            QtCore.QPointF(e.pos())).length())
        elif self.mode == "move":
            self.center = QtCore.QPointF(e.pos()) - self.drag_offset
        elif self.mode == "resize":
            self.radius = max(self.MIN_RADIUS,
                              QtCore.QLineF(self.center,
                                            QtCore.QPointF(e.pos())).length())
        self.update()

    def mouseReleaseEvent(self, e):
        if e.button() == QtCore.Qt.LeftButton:
            if self.active and self.radius > 0 and self.mode in ("new", "move", "resize"):
                self._sync_current()
            self.mode = None

    def mouseDoubleClickEvent(self, e):
        if e.button() == QtCore.Qt.LeftButton and self.active and self.radius > 0:
            d = QtCore.QLineF(self.center, QtCore.QPointF(e.pos())).length()
            if d <= self.radius:
                self.finish()

    def wheelEvent(self, e):
        if self.active and self.radius > 0:
            delta = 5 if e.angleDelta().y() > 0 else -5
            self.radius = max(self.MIN_RADIUS, self.radius + delta)
            self._sync_current()
            self.update()

    # ---------------- 键盘 ----------------
    def keyPressEvent(self, e):
        k = e.key()
        if k in (QtCore.Qt.Key_Return, QtCore.Qt.Key_Enter):
            if self.active and self.radius >= 1:
                self.finish()
        elif k == QtCore.Qt.Key_Escape:
            self.cancelled.emit()
            self.close()
        elif k in (QtCore.Qt.Key_Right, QtCore.Qt.Key_Tab):
            self._next()
        elif k in (QtCore.Qt.Key_Left, QtCore.Qt.Key_Backtab):
            self._prev()
        elif QtCore.Qt.Key_1 <= k <= QtCore.Qt.Key_9:
            n = k - QtCore.Qt.Key_1
            if n < len(self.circles):
                self._switch(n)
        elif k == QtCore.Qt.Key_N:
            self._add_new()

    def event(self, ev):
        # 拦截 Tab / Shift+Tab，避免被 Qt 当焦点切换吞掉
        if ev.type() == QtCore.QEvent.KeyPress and \
                ev.key() in (QtCore.Qt.Key_Tab, QtCore.Qt.Key_Backtab):
            if ev.key() == QtCore.Qt.Key_Tab:
                self._next()
            else:
                self._prev()
            return True
        return super().event(ev)

    def closeEvent(self, e):
        try:
            self.releaseKeyboard()
        except Exception:
            pass
        super().closeEvent(e)

    # ---------------- 输出 ----------------
    def finish(self):
        if not (self.active and self.radius >= 1):
            self.close()
            return
        self._sync_current()
        save_cfg({"current": self.idx, "circles": self.circles})
        gcx = self.center.x() + self.vg.x()
        gcy = self.center.y() + self.vg.y()
        gr = float(self.radius)
        img = crop_circle(self.bg, self.vg, gcx, gcy, gr)
        if img is not None:
            self.captured.emit(img)
        self.close()


class Controller(QtCore.QObject):
    def __init__(self):
        super().__init__()
        self.busy = False
        self.overlay = None

    def trigger(self):
        if self.busy:
            return
        self.busy = True
        QtCore.QTimer.singleShot(100, self._do_capture)

    def _do_capture(self):
        try:
            bg, vg = grab_virtual_desktop()
        except Exception as ex:
            print("[错误] 抓屏失败:", ex)
            self.busy = False
            return

        cfg = load_cfg()
        self.overlay = CircleOverlay(bg, vg, cfg)
        self.overlay.captured.connect(self._on_captured)
        self.overlay.cancelled.connect(self._on_cancel)
        self.overlay.show()
        self.overlay.raise_()
        self.overlay.activateWindow()
        self.overlay.setFocus()
        self.overlay.grabKeyboard()

    def _on_cancel(self):
        self.busy = False
        self.overlay = None

    def _on_captured(self, img):
        if img is None:
            self.busy = False
            return
        try:
            os.makedirs(SAVE_DIR, exist_ok=True)
            name = datetime.datetime.now().strftime(
                "circle_%Y%m%d_%H%M%S_%f")[:-3] + ".png"
            path = os.path.join(SAVE_DIR, name)
            if img.save(path, "PNG"):
                print("[已保存]", path)
            else:
                print("[错误] 保存失败")
        except Exception as ex:
            print("[错误] 保存异常:", ex)
        if COPY_TO_CLIPBOARD:
            QtWidgets.QApplication.clipboard().setImage(img)
        self.busy = False
        self.overlay = None


class HotkeyBridge(QtCore.QObject):
    fired = QtCore.pyqtSignal()
    quit_req = QtCore.pyqtSignal()


def main():
    QtWidgets.QApplication.setAttribute(QtCore.Qt.AA_EnableHighDpiScaling, True)
    QtWidgets.QApplication.setAttribute(QtCore.Qt.AA_UseHighDpiPixmaps, True)

    app = QtWidgets.QApplication(sys.argv)
    app.setQuitOnLastWindowClosed(False)

    controller = Controller()
    bridge = HotkeyBridge()
    bridge.fired.connect(controller.trigger, QtCore.Qt.QueuedConnection)
    bridge.quit_req.connect(app.quit, QtCore.Qt.QueuedConnection)

    try:
        keyboard.add_hotkey(HOTKEY, bridge.fired.emit)
        keyboard.add_hotkey(EXIT_HOTKEY, bridge.quit_req.emit)
    except Exception as ex:
        print("[错误] 注册热键失败:", ex)
        print("请尝试以管理员身份运行。")
        sys.exit(1)

    print(f"圆形截图已启动：{HOTKEY} 截图 / {EXIT_HOTKEY} 退出")
    print(f"保存目录：{SAVE_DIR}")
    print(f"配置路径：{CONFIG_PATH}")
    cfg = load_cfg()
    if cfg:
        print(f"已加载 {len(cfg['circles'])} 个位置，当前 #{cfg['current'] + 1}")
        for i, c in enumerate(cfg["circles"]):
            mark = "*" if i == cfg["current"] else " "
            print(f"  {mark} [{i + 1}] {c['name']}  "
                  f"({int(c['cx'])}, {int(c['cy'])})  r={int(c['r'])}")
    else:
        print("首次使用：按下快捷键后拖动鼠标画出圆形")

    sys.exit(app.exec_())


if __name__ == "__main__":
    main()