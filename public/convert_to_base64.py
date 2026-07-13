import base64
import os

# ====== 修改此处为您的图片文件名 ======
IMAGE_FILE = "naruto-icon.png"  # 改成您的图片文件名，如 "my_icon.gif" 或 "logo.png"
# ====================================

script_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(script_dir, IMAGE_FILE)

try:
    with open(image_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode()
        # 根据文件扩展名自动生成正确的 Data URI 前缀
        ext = os.path.splitext(IMAGE_FILE)[1].lower()
        if ext in ['.png']:
            mime = 'image/png'
        elif ext in ['.gif']:
            mime = 'image/gif'
        elif ext in ['.jpg', '.jpeg']:
            mime = 'image/jpeg'
        else:
            mime = 'application/octet-stream'  # 未知格式，但 Base64 仍可用
        data_uri = f"data:{mime};base64,{encoded}"

        # 将结果写入同目录下的 favicon_base64.txt
        output_path = os.path.join(script_dir, "favicon_base64.txt")
        with open(output_path, "w", encoding="utf-8") as out:
            out.write(data_uri)
        print(f"✅ 转换成功！Base64 数据已写入 {output_path}")
        print(f"📌 请将此 TXT 文件中的完整字符串复制到 index.html 的图标 href 中。")
except FileNotFoundError:
    print(f"❌ 错误：找不到文件 {image_path}")
    print("请确保图片文件位于 public/ 文件夹内，并已修改脚本中的 IMAGE_FILE 为正确的文件名。")