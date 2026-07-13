import json
import base64
import io
import re
from PIL import Image
import os

# ================= 配置 =================
INPUT_JSON = "导出数据及压缩/naruto-data-2026-07-12.json"  # 输入文件名
OUTPUT_JSON = "导出数据及压缩/naruto-data-compressed.json"  # 输出文件名
WEBP_QUALITY = 80  # WebP 质量（1-100），80 是推荐平衡点
MAX_IMAGE_SIZE = (800, 800)  # 限制图片最大尺寸，防止过大

def compress_base64_image(base64_str: str) -> str:
    """将 Base64 编码的图片转换为 WebP 并返回新的 Base64 字符串"""
    # 匹配 data:image/...;base64,... 前缀
    match = re.match(r'^data:image/(\w+);base64,(.+)$', base64_str)
    if not match:
        return base64_str

    img_format = match.group(1).lower()  # png, jpeg, jpg, webp...
    img_data = match.group(2)

    # 🔥 如果已经是 WebP 格式，跳过压缩，避免重复压缩
    if img_format == 'webp':
        return base64_str

    try:
        img_bytes = base64.b64decode(img_data)
    except Exception:
        return base64_str

    try:
        with Image.open(io.BytesIO(img_bytes)) as img:
            img.thumbnail(MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            output = io.BytesIO()
            img.save(output, format='webp', quality=WEBP_QUALITY)
            webp_bytes = output.getvalue()
        new_b64 = base64.b64encode(webp_bytes).decode('utf-8')
        return f'data:image/webp;base64,{new_b64}'
    except Exception as e:
        print(f"  压缩图片失败: {e}")
        return base64_str

def process_entity(entity):
    """处理单个对象（忍者/密卷/通灵）中的 imageUrl"""
    if 'imageUrl' in entity and entity['imageUrl']:
        entity['imageUrl'] = compress_base64_image(entity['imageUrl'])

def main():
    if not os.path.exists(INPUT_JSON):
        print(f"❌ 输入文件 {INPUT_JSON} 不存在！")
        return

    print(f"📖 读取 {INPUT_JSON}...")
    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 统计
    total_processed = 0
    for key in ['ninjas', 'scrolls', 'summons', 'recommendations', 'counters']:
        if key in data:
            arr = data[key]
            if isinstance(arr, list):
                for item in arr:
                    if isinstance(item, dict):
                        # 处理 imageUrl
                        if 'imageUrl' in item:
                            process_entity(item)
                            total_processed += 1
                        # 针对 recommendations 中的 scrolls 数组？
                        # 推荐搭配里没有 imageUrl，忽略
    print(f"✅ 处理了 {total_processed} 个对象的图片。")

    # 保存新 JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"💾 压缩后的数据已保存至 {OUTPUT_JSON}")
    print("📌 接下来请用此 JSON 替换 src/data/ 下的 TypeScript 文件中的 Mock 数组。")

if __name__ == '__main__':
    main()