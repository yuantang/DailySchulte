#!/usr/bin/env python3
"""
DailySchulte App Store Promotional Posters Generator (1290 x 2796 px)
Generates studio-grade ASO promotional banners with modern gradients,
high-contrast typography, and premium iPhone titanium mockup frames.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

POSTER_WIDTH = 1290
POSTER_HEIGHT = 2796

FONT_PATH = '/System/Library/Fonts/Hiragino Sans GB.ttc'
FONT_REGULAR = 0  # W3
FONT_BOLD = 2     # W6

PROMOTIONAL_CONFIGS = [
    {
        "id": "01_core_training",
        "raw_image": "01_home_classic.png",
        "tag": "🎯 科学专注力训练",
        "title": "视野广度拓展 · 激活全脑潜能",
        "subtitle": "国际公认舒尔特方格法 · 突破视知觉与专注边界",
        "gradient_top": (10, 15, 30),      # Deep Midnight Navy
        "gradient_bottom": (23, 37, 84),   # Rich Royal Blue
        "glow_color": (59, 130, 246, 60),  # Electric Blue Glow
        "pill_bg": (30, 58, 138, 180),
        "pill_border": (96, 165, 250, 160),
        "pill_text": (191, 219, 254),
    },
    {
        "id": "02_creative_modes",
        "raw_image": "02_mode_drawer.png",
        "tag": "🧩 100+ 题型与盘面",
        "title": "千变题型形态 · 告别单调枯燥",
        "subtitle": "正逆序/红黑混淆/诗词成语 · 蜂巢/爱心/星芒百变形态",
        "gradient_top": (15, 11, 28),      # Deep Obsidian Plum
        "gradient_bottom": (46, 16, 101),  # Twilight Purple
        "glow_color": (168, 85, 247, 60),  # Purple Glow
        "pill_bg": (88, 28, 135, 180),
        "pill_border": (192, 132, 252, 160),
        "pill_text": (233, 213, 255),
    },
    {
        "id": "03_specialized_plans",
        "raw_image": "04_training_plans.png",
        "tag": "📚 100 套科学专注方案",
        "title": "系统阶梯训练 · 循序渐进跃迁",
        "subtitle": "视觉搜索/抗干扰/速读速记 · 从入门到大师级量化进阶",
        "gradient_top": (24, 18, 11),      # Deep Warm Obsidian
        "gradient_bottom": (69, 26, 3),    # Imperial Amber Brown
        "glow_color": (245, 158, 11, 60),  # Amber Glow
        "pill_bg": (120, 53, 15, 180),
        "pill_border": (251, 191, 36, 160),
        "pill_text": (254, 243, 199),
    },
    {
        "id": "04_cognitive_analytics",
        "raw_image": "05_analytics_dashboard.png",
        "tag": "📊 全维认知雷达复盘",
        "title": "数据驱动进阶 · 见证脑力蜕变",
        "subtitle": "反应延迟/轨迹复盘/年度热力图 · 科学量化专注每一微秒",
        "gradient_top": (8, 20, 24),       # Deep Abyssal Slate
        "gradient_bottom": (6, 78, 59),    # Deep Emerald Green
        "glow_color": (16, 185, 129, 60),  # Emerald Glow
        "pill_bg": (6, 95, 70, 180),
        "pill_border": (52, 211, 153, 160),
        "pill_text": (209, 250, 229),
    },
    {
        "id": "05_daily_habit",
        "raw_image": "06_daily_checkin.png",
        "tag": "🔥 习惯养成与每日挑战",
        "title": "每日专注打卡 · 铸就自律飞轮",
        "subtitle": "今日挑战/连续打卡里程碑/智能提醒 · 轻松养成高效生活习惯",
        "gradient_top": (25, 11, 11),      # Deep Crimson Ash
        "gradient_bottom": (76, 5, 25),    # Rich Ruby Red
        "glow_color": (244, 63, 94, 60),   # Rose Crimson Glow
        "pill_bg": (136, 19, 55, 180),
        "pill_border": (251, 113, 133, 160),
        "pill_text": (255, 228, 230),
    },
    {
        "id": "06_gameplay_focus",
        "raw_image": "07_gameplay_active.png",
        "tag": "⚡️ 毫秒级极速竞技",
        "title": "全神贯注沉浸 · 毫秒巅峰挑战",
        "subtitle": "专属无扰心流界面 · 实时动态目标指引与高频极限冲刺",
        "gradient_top": (12, 18, 28),      # Deep Cyan Slate
        "gradient_bottom": (15, 76, 92),   # Ocean Cyan
        "glow_color": (6, 182, 212, 60),   # Cyan Glow
        "pill_bg": (14, 116, 144, 180),
        "pill_border": (34, 211, 238, 160),
        "pill_text": (207, 250, 254),
    },
]

def create_vertical_gradient(width, height, top_rgb, bottom_rgb):
    """Generate smooth vertical gradient background."""
    base = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(base)
    for y in range(height):
        ratio = y / float(height)
        # Apply slight curve for deeper contrast
        e_ratio = math.pow(ratio, 1.15)
        r = int(top_rgb[0] + (bottom_rgb[0] - top_rgb[0]) * e_ratio)
        g = int(top_rgb[1] + (bottom_rgb[1] - top_rgb[1]) * e_ratio)
        b = int(top_rgb[2] + (bottom_rgb[2] - top_rgb[2]) * e_ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return base.convert('RGBA')

def draw_ambient_light(canvas, center_x, center_y, radius, color):
    """Create subtle ambient light glow behind mockup."""
    glow_layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse(
        [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
        fill=color
    )
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius // 2))
    return Image.alpha_composite(canvas, glow_layer)

def build_phone_mockup(raw_screenshot_path, target_width=1000, target_height=2174):
    """
    Constructs ultra-detailed iPhone 16/17 Pro Titanium Mockup
    with screen masking, subtle bezel rim, and Dynamic Island.
    """
    raw_img = Image.open(raw_screenshot_path).convert('RGBA')
    
    mockup = Image.new('RGBA', (target_width, target_height), (0, 0, 0, 0))
    
    # Outer frame dimensions
    bezel_thickness = 13
    corner_radius_outer = 72
    corner_radius_inner = 60
    
    # 1. Outer Titanium Chassis
    chassis_draw = ImageDraw.Draw(mockup)
    # Specular rim
    chassis_draw.rounded_rectangle(
        [0, 0, target_width - 1, target_height - 1],
        radius=corner_radius_outer,
        fill=(39, 39, 42, 255),
        outline=(82, 82, 91, 200),
        width=2
    )
    
    # 2. Prepare screen content (scaled and rounded)
    screen_w = target_width - (bezel_thickness * 2)
    screen_h = target_height - (bezel_thickness * 2)
    
    # Resize screenshot with high quality Lanczos filter
    resized_screen = raw_img.resize((screen_w, screen_h), Image.Resampling.LANCZOS)
    
    # Create mask with smooth rounded corners
    screen_mask = Image.new('L', (screen_w, screen_h), 0)
    mask_draw = ImageDraw.Draw(screen_mask)
    mask_draw.rounded_rectangle(
        [0, 0, screen_w - 1, screen_h - 1],
        radius=corner_radius_inner,
        fill=255
    )
    
    # Dynamic Island overlay on screen
    island_w = 260
    island_h = 72
    island_radius = 36
    island_x = (screen_w - island_w) // 2
    island_y = 30
    
    island_draw = ImageDraw.Draw(resized_screen)
    island_draw.rounded_rectangle(
        [island_x, island_y, island_x + island_w, island_y + island_h],
        radius=island_radius,
        fill=(0, 0, 0, 255)
    )
    # Subtle camera lens reflection inside Island
    island_draw.ellipse(
        [island_x + island_w - 46, island_y + 22, island_x + island_w - 18, island_y + 50],
        fill=(15, 23, 42, 220),
        outline=(30, 41, 59, 180),
        width=1
    )
    
    # Paste masked screen into mockup chassis
    mockup.paste(resized_screen, (bezel_thickness, bezel_thickness), screen_mask)
    
    # 3. Inner Screen Edge Subtle Shadow/Border
    inner_border_draw = ImageDraw.Draw(mockup)
    inner_border_draw.rounded_rectangle(
        [bezel_thickness, bezel_thickness, target_width - bezel_thickness - 1, target_height - bezel_thickness - 1],
        radius=corner_radius_inner,
        outline=(0, 0, 0, 160),
        width=2
    )
    
    return mockup

def render_promotional_poster(config, raw_dir, output_path):
    """Renders single 1290x2796 promotional poster."""
    print(f"Generating poster: {config['id']}...")
    
    # 1. Base gradient canvas
    canvas = create_vertical_gradient(
        POSTER_WIDTH, POSTER_HEIGHT,
        config['gradient_top'], config['gradient_bottom']
    )
    
    # 2. Ambient light spot behind the phone
    phone_center_x = POSTER_WIDTH // 2
    phone_center_y = 1600
    canvas = draw_ambient_light(
        canvas, phone_center_x, phone_center_y,
        radius=650, color=config['glow_color']
    )
    
    # 3. Typography Setup
    font_tag = ImageFont.truetype(FONT_PATH, 34, index=FONT_BOLD)
    font_title = ImageFont.truetype(FONT_PATH, 74, index=FONT_BOLD)
    font_sub = ImageFont.truetype(FONT_PATH, 38, index=FONT_REGULAR)
    
    draw = ImageDraw.Draw(canvas)
    
    # 4. Pill Badge (Category Tag)
    tag_text = config['tag']
    tag_bbox = draw.textbbox((0, 0), tag_text, font=font_tag)
    tag_w = tag_bbox[2] - tag_bbox[0]
    tag_h = tag_bbox[3] - tag_bbox[1]
    
    pill_padding_x = 36
    pill_padding_y = 16
    pill_w = tag_w + pill_padding_x * 2
    pill_h = tag_h + pill_padding_y * 2
    pill_x = (POSTER_WIDTH - pill_w) // 2
    pill_y = 175
    
    # Draw frosted pill background
    draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=pill_h // 2,
        fill=config['pill_bg'],
        outline=config['pill_border'],
        width=2
    )
    # Pill text centered
    text_x = pill_x + (pill_w - tag_w) // 2
    text_y = pill_y + (pill_h - tag_h) // 2 - 2
    draw.text((text_x, text_y), tag_text, font=font_tag, fill=config['pill_text'])
    
    # 5. Main Title (主标题)
    title_text = config['title']
    title_bbox = draw.textbbox((0, 0), title_text, font=font_title)
    title_w = title_bbox[2] - title_bbox[0]
    title_x = (POSTER_WIDTH - title_w) // 2
    title_y = pill_y + pill_h + 38
    
    # Subtle title shadow for crisp punchiness
    draw.text((title_x, title_y + 2), title_text, font=font_title, fill=(0, 0, 0, 140))
    draw.text((title_x, title_y), title_text, font=font_title, fill=(255, 255, 255, 255))
    
    # 6. Subtitle (副标题)
    sub_text = config['subtitle']
    sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_x = (POSTER_WIDTH - sub_w) // 2
    sub_y = title_y + 74 + 28
    
    draw.text((sub_x, sub_y + 1), sub_text, font=font_sub, fill=(0, 0, 0, 100))
    draw.text((sub_x, sub_y), sub_text, font=font_sub, fill=(203, 213, 225, 245))  # Slate-300
    
    # 7. Build Phone Mockup
    raw_path = os.path.join(raw_dir, config['raw_image'])
    mockup_w = 990
    mockup_h = 2152
    phone_img = build_phone_mockup(raw_path, target_width=mockup_w, target_height=mockup_h)
    
    # 8. Render Realistic Multi-Stage Drop Shadow under Phone
    shadow_layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_layer)
    phone_x = (POSTER_WIDTH - mockup_w) // 2
    phone_y = 590
    
    # Stage 1: Broad soft ambient drop shadow
    shadow_draw.rounded_rectangle(
        [phone_x + 10, phone_y + 36, phone_x + mockup_w - 10, phone_y + mockup_h + 20],
        radius=80,
        fill=(0, 0, 0, 110)
    )
    # Stage 2: Deep contact occlusion shadow
    shadow_draw.rounded_rectangle(
        [phone_x + 25, phone_y + 55, phone_x + mockup_w - 25, phone_y + mockup_h + 30],
        radius=70,
        fill=(0, 0, 0, 150)
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(38))
    canvas = Image.alpha_composite(canvas, shadow_layer)
    
    # 9. Composite Mockup onto Poster
    canvas.paste(phone_img, (phone_x, phone_y), phone_img)
    
    # 10. Save Final Image (Optimized 24-bit PNG)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    canvas.convert('RGB').save(output_path, 'PNG', quality=95, optimize=True)
    print(f" Saved: {output_path} ({os.path.getsize(output_path) // 1024} KB)")

def main():
    base_dir = '/Users/tangyuan/antigravity/每日舒尔特'
    raw_dir = os.path.join(base_dir, 'screenshots', 'raw')
    framed_dir = os.path.join(base_dir, 'screenshots', 'framed')
    artifacts_dir = '/Users/tangyuan/.gemini/antigravity/brain/f1023ccb-c104-437e-ba74-75b680b2d336'
    
    os.makedirs(framed_dir, exist_ok=True)
    
    for idx, cfg in enumerate(PROMOTIONAL_CONFIGS, 1):
        filename = f"promo_0{idx}_{cfg['id']}.png"
        out_path = os.path.join(framed_dir, filename)
        render_promotional_poster(cfg, raw_dir, out_path)
        
        # Also copy to artifacts dir for immediate interactive display
        artifact_copy = os.path.join(artifacts_dir, f"aso_promo_0{idx}.png")
        Image.open(out_path).save(artifact_copy, 'PNG')
        print(f" Artifact ready: {artifact_copy}")

    print("\n🎉 All 5 App Store promotional posters successfully generated!")

if __name__ == '__main__':
    main()
