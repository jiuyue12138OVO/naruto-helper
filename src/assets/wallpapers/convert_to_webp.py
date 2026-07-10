import os
from PIL import Image

# 获取当前脚本所在目录（即 src/assets/wallpapers）
folder = os.path.dirname(os.path.abspath(__file__))

# ---------- 配置参数（可按需调整） ----------
MAX_SIZE = (1920, 1080)      # 限制图片最大宽高，超出等比例缩小
WEBP_QUALITY = 75            # WebP 质量（1-100），75 在画质与体积间取得平衡
DELETE_ORIGINALS = True      # 转换后是否删除原文件（仅对新格式图片有效）
# -------------------------------------------

# 需要转换为 WebP 的原图格式
convert_extensions = ('.jpg', '.jpeg', '.png')

# 处理所有图片文件
for filename in os.listdir(folder):
    filepath = os.path.join(folder, filename)
    base, ext = os.path.splitext(filename)
    ext_lower = ext.lower()

    try:
        img = Image.open(filepath)
        # 限制图片尺寸
        img.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)

        if ext_lower in convert_extensions:
            # 新图：转换为 WebP 并保存
            new_name = base + '.webp'
            new_path = os.path.join(folder, new_name)
            img.save(new_path, 'webp', quality=WEBP_QUALITY)
            print(f'✅ 转换完成: {filename} -> {new_name}')
            if DELETE_ORIGINALS:
                os.remove(filepath)
                print(f'🗑️ 已删除原文件: {filename}')
        elif ext_lower == '.webp':
            # 已有的 WebP：直接覆盖二次压缩
            img.save(filepath, 'webp', quality=WEBP_QUALITY)
            print(f'🔄 二次压缩: {filename}')
        else:
            print(f'⏭️ 跳过非图片文件: {filename}')
    except Exception as e:
        print(f'❌ 处理失败 {filename}: {e}')

print('\n🎉 所有图片处理完毕！')