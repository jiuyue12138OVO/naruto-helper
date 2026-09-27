# -*- coding: utf-8 -*-
"""
圆形区域截图工具（增强版）
- 全局快捷键触发
- 拖动圆心移动 / 拖动圆弧缩放 / 滚轮微调
- 位置和大小自动保存，下次直接沿用
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
HOTKEY = "ctrl+alt+o"                    # 截图快捷键
EXIT_HOTKEY = "ctrl+alt+q"               # 退出快捷键
SAVE_DIR = r"C:\Users\jiuyu\Pictures\Screenshots"
COPY_TO_CLIPBOARD = True                 # 同时复制到剪贴板

# 配置文件放在脚本同目录，方便管理
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(SCRIPT_DIR, "circle_shot_config.json")

# 没有历史配置时的初始圆，格式 (cx, cy, r)，None 表示首次手动拖
FIXED_CIRCLE = None
# ===========================================


def load_cfg():
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            d = json.load(f)
        if all(k in d for k in ("cx", "cy", "r")):
            return d
    except Exception:
        pass
    return None


def save_cfg(cx, cy, r):
    try:
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump({"cx": float(cx), "cy": float(cy), "r": float(r)},
                      f, ensure_ascii=False, indent=2)
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

    def __init__(self, bg, vg, init_cx=None, init_cy=None, init_r=None):
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

        self.center = QtCore.QPointF(0, 0)
        self.radius = 0.0
        self.active = False
        self.mode = None
        self.drag_offset = QtCore.QPointF(0, 0)

        if init_cx is not None and init_r and init_r > 0:
            self.center = QtCore.QPointF(init_cx, init_cy)
            self.radius = float(init_r)
            self.active = True

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

            # 半径 / 圆心坐标信息
            p.setPen(QtGui.QColor(255, 255, 255, 240))
            p.setFont(QtGui.QFont("Microsoft YaHei", 10))
            gcx = int(c.x() + self.vg.x())
            gcy = int(c.y() + self.vg.y())
            info = f"r={int(self.radius)}  ({gcx}, {gcy})"
            fm = QtGui.QFontMetrics(p.font())
            w = fm.horizontalAdvance(info) + 8
            tx = c.x() + self.radius + 10
            ty = c.y()
            if tx + w > self.width():
                tx = c.x() - self.radius - w - 10
            ty = max(20, min(ty, self.height() - 10))
            p.drawText(int(tx), int(ty), info)

        # 顶部操作提示
        p.setPen(QtGui.QColor(255, 255, 255, 230))
        p.setFont(QtGui.QFont("Microsoft YaHei", 11))
        p.drawText(24, 42,
                   "拖动圆心移动 | 拖动圆弧缩放 | 滚轮微调 | 圆外拖动重画 | "
                   "Enter / 双击圆内 确认 | Esc 取消")

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
            self.update()

    # ---------------- 键盘 ----------------
    def keyPressEvent(self, e):
        if e.key() in (QtCore.Qt.Key_Return, QtCore.Qt.Key_Enter):
            if self.active and self.radius >= 1:
                self.finish()
        elif e.key() == QtCore.Qt.Key_Escape:
            self.cancelled.emit()
            self.close()

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
        gcx = self.center.x() + self.vg.x()
        gcy = self.center.y() + self.vg.y()
        gr = float(self.radius)
        save_cfg(gcx, gcy, gr)                 # 保存这次的位置，下次沿用
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

        init_cx = init_cy = init_r = None
        cfg = load_cfg()
        if cfg:
            init_cx = cfg["cx"] - vg.x()
            init_cy = cfg["cy"] - vg.y()
            init_r = cfg["r"]
        elif FIXED_CIRCLE:
            cx, cy, r = FIXED_CIRCLE
            init_cx = cx - vg.x()
            init_cy = cy - vg.y()
            init_r = r

        self.overlay = CircleOverlay(bg, vg, init_cx, init_cy, init_r)
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
    if load_cfg():
        print("已加载上次保存的圆形位置")
    elif FIXED_CIRCLE:
        print(f"使用固定初始圆：{FIXED_CIRCLE}")
    else:
        print("首次使用：按下快捷键后拖动鼠标画出圆形")

    sys.exit(app.exec_())


if __name__ == "__main__":
    main()