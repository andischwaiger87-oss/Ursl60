import os

html_template = """<!DOCTYPE html>
<html lang="de" class="light">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Ursula - 60 Jahre in Bildern</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary": "#000000",
                        "on-primary": "#ffffff",
                        "surface-container-lowest": "#ffffff",
                        "surface-container-low": "#f3f3f4",
                        "on-surface": "#1a1c1c",
                        "on-surface-variant": "#444748",
                        "secondary": "#5e5e5e",
                        "outline-variant": "#c4c7c7",
                        "tertiary": "#000000"
                    },
                    "spacing": {
                        "container-max": "1200px",
                        "vertical-line-width": "1px",
                        "margin-desktop": "64px",
                        "margin-mobile": "20px"
                    }
                }
            }
        }
    </script>
    <style>
        .font-headline-sm { font-family: 'Playfair Display', serif; }
        .font-headline-md { font-family: 'Playfair Display', serif; }
        .font-display-lg { font-family: 'Playfair Display', serif; }
        .font-display-lg-mobile { font-family: 'Playfair Display', serif; }
        .font-body-md { font-family: 'Geist', sans-serif; }
        .font-body-lg { font-family: 'Geist', sans-serif; }
        .font-label-sm { font-family: 'Geist', sans-serif; }
        
        /* Subtle interactive micro-depth */
        .image-card {
            transition: box-shadow 0.4s ease, transform 0.4s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }
        .group:hover .image-card {
            box-shadow: 0 12px 40px rgba(0,0,0,0.08);
            transform: translateY(-4px) scale(1.01);
        }
        
        /* Scroll Reveal Animation */
        .scroll-reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal.show {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body class="bg-surface-container-lowest text-on-surface font-body-md antialiased min-h-screen flex flex-col">

    <!-- Hero Section (Angepasst an Design) -->
    <section class="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0 bg-cover bg-center" style="background-image: url('29.jpg');"></div>
        <div class="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-tertiary/60"></div>
        <div class="relative z-20 text-center flex flex-col items-center px-margin-mobile md:px-margin-desktop mt-32">
            <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-[80px] tracking-[0.2em] text-on-primary uppercase mb-6 drop-shadow-lg">URSULA</h1>
            <p class="font-headline-md text-headline-md text-on-primary italic mb-12 drop-shadow-md">60 Jahre in Bildern</p>
            <a href="#gallery" class="border border-on-primary/60 text-on-primary px-8 py-4 rounded-lg hover:bg-on-primary hover:text-primary transition-all duration-300 font-label-sm text-[13px] uppercase tracking-[0.15em] backdrop-blur-sm">
                Zeitreise starten
            </a>
        </div>
    </section>

    <main class="flex-grow" id="gallery">
        <!-- Vertical Timeline Gallery -->
        <section class="relative w-full max-w-container-max mx-auto py-32 px-margin-mobile md:px-margin-desktop">
            <!-- Central Line -->
            <div class="absolute left-1/2 top-0 bottom-0 w-vertical-line-width bg-outline-variant/50 transform -translate-x-1/2 hidden md:block"></div>

            {timeline_items}

        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-surface-container-lowest border-t border-outline-variant/30 mt-16">
        <div class="flex flex-col justify-center items-center w-full py-16 max-w-container-max mx-auto gap-4">
            <div class="font-headline-sm text-headline-sm text-primary tracking-widest uppercase mb-4">
                Alles Gute zum 60. Geburtstag!
            </div>
            <div class="font-body-md text-body-md text-secondary text-sm">
                Von Herzen, deine Familie.
            </div>
        </div>
    </footer>

    <!-- App JS -->
    <script src="js/app.js"></script>
</body>
</html>
"""

item_template_odd = """
            <!-- Timeline Item {i} (Left) -->
            <div class="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 mb-24 md:mb-32 group scroll-reveal">
                <!-- Marker -->
                <div class="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-outline-variant bg-surface-container-lowest z-10 transition-all duration-500 group-hover:scale-150 group-hover:bg-primary group-hover:border-primary shadow-sm"></div>
                <div class="w-full md:w-1/2 md:pr-16 flex justify-end">
                    <div class="w-full max-w-md rounded-xl overflow-hidden image-card border border-outline-variant/20 bg-surface-container-lowest p-2">
                        <img alt="Erinnerung {i}" class="w-full h-auto rounded-lg object-cover" src="{img_src}">
                    </div>
                </div>
                <div class="w-full md:w-1/2 md:pl-16 text-center md:text-left mt-6 md:mt-0">
                    <span class="font-label-sm text-[12px] text-secondary uppercase tracking-[0.15em] block mb-4">Jahr / Ereignis</span>
                    <h2 class="font-headline-sm text-[28px] text-primary mb-4">Erinnerung {i}</h2>
                    <p class="font-body-md text-[15px] text-on-surface-variant max-w-md mx-auto md:mx-0 leading-relaxed">
                        Hier ist Platz für eine kurze Geschichte oder liebe Worte zu diesem Foto.
                    </p>
                </div>
            </div>
"""

item_template_even = """
            <!-- Timeline Item {i} (Right) -->
            <div class="relative flex flex-col md:flex-row-reverse items-center justify-center gap-12 md:gap-16 mb-24 md:mb-32 group scroll-reveal">
                <!-- Marker -->
                <div class="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-outline-variant bg-surface-container-lowest z-10 transition-all duration-500 group-hover:scale-150 group-hover:bg-primary group-hover:border-primary shadow-sm"></div>
                <div class="w-full md:w-1/2 md:pl-16 flex justify-start">
                    <div class="w-full max-w-md rounded-xl overflow-hidden image-card border border-outline-variant/20 bg-surface-container-lowest p-2">
                        <img alt="Erinnerung {i}" class="w-full h-auto rounded-lg object-cover" src="{img_src}">
                    </div>
                </div>
                <div class="w-full md:w-1/2 md:pr-16 text-center md:text-right mt-6 md:mt-0">
                    <span class="font-label-sm text-[12px] text-secondary uppercase tracking-[0.15em] block mb-4">Jahr / Ereignis</span>
                    <h2 class="font-headline-sm text-[28px] text-primary mb-4">Erinnerung {i}</h2>
                    <p class="font-body-md text-[15px] text-on-surface-variant max-w-md mx-auto md:mx-0 md:ml-auto leading-relaxed">
                        Hier ist Platz für eine kurze Geschichte oder liebe Worte zu diesem Foto.
                    </p>
                </div>
            </div>
"""

timeline_items = ""
for i in range(1, 30):
    img_src = f"{i:02d}.jpg"
    if i % 2 != 0:
        timeline_items += item_template_odd.format(i=i, img_src=img_src)
    else:
        timeline_items += item_template_even.format(i=i, img_src=img_src)

html_content = html_template.replace("{timeline_items}", timeline_items)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("index.html created successfully.")
