import os
from PIL import Image

# 获取当前脚本所在目录
folder = os.path.dirname(os.path.abspath(__file__))

# 支持的输入格式
extensions = ('.jpg', '.jpeg', '.png')

for filename in os.listdir(folder):
    if filename.lower().endswith(extensions):
        filepath = os.path.join(folder, filename)
        try:
            img = Image.open(filepath)
            # 生成新文件名（替换扩展名为 .webp）
            new_name = os.path.splitext(filename)[0] + '.webp'
            new_path = os.path.join(folder, new_name)
            # 保存为 WebP，quality 可调 (1-100，默认 80 已很不错)
            img.save(new_path, 'webp', quality=80)
            print(f'✅ 已转换: {filename} -> {new_name}')
            # 转换成功后删除原文件
            os.remove(filepath)
            print(f'🗑️ 已删除原文件: {filename}')
        except Exception as e:
            print(f'❌ 转换失败 {filename}: {e}')

print('\n🎉 全部处理完毕！')