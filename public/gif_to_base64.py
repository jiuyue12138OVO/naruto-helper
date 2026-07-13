import base64
import os

# GIF 文件的相对路径（相对于脚本所在目录）
gif_path = os.path.join(os.path.dirname(__file__), "naruto.gif")

try:
    with open(gif_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode()
        data_uri = f"data:image/gif;base64,{encoded}"
        print("✅ 转换成功！Base64 数据已写入 favicon_base64.txt")
        # 将结果写入脚本同目录下的 favicon_base64.txt
        output_path = os.path.join(os.path.dirname(__file__), "favicon_base64.txt")
        with open(output_path, "w", encoding="utf-8") as out:
            out.write(data_uri)
except FileNotFoundError:
    print(f"❌ 错误：找不到文件 {gif_path}")
    print("请确保 naruto.gif 位于 public/ 文件夹内。")