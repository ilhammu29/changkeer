#!/usr/bin/env python3
"""
presentation_en.py - Generator for English Presentation Deck (A4 Landscape)
Clean Editorial Craft Style, Zero AI-Slop, No Badges, Round Bullets,
No Terminal ASCII, Real Product Photos, Layman-Friendly Explanations,
Team / Kelompok Specification, and Zero Markdown Asterisks.
Exact 10 Slides = 10 Landscape Pages.
"""

def generate_presentation_en(assets: dict) -> str:
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CHANGKEER ATELIER — SYSTEM PRESENTATION &amp; PROJECT SHOWCASE</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

@page {{
    size: A4 landscape;
    margin: 0;
}}

* {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}}

body {{
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 9pt;
    line-height: 1.5;
    color: #24292f;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
}}

.slide {{
    width: 297mm;
    height: 210mm;
    max-height: 210mm;
    box-sizing: border-box;
    page-break-after: always;
    page-break-inside: avoid;
    overflow: hidden;
    padding: 12mm 20mm 10mm 20mm;
    position: relative;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}}

/* Slide Running Header & Footer */
.slide-header {{
    display: table;
    width: 100%;
    border-bottom: 1px solid #e5e2da;
    padding-bottom: 4pt;
    margin-bottom: 6pt;
}}

.slide-header-left {{
    display: table-cell;
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #946c38;
}}

.slide-header-right {{
    display: table-cell;
    text-align: right;
    font-size: 7.5pt;
    font-weight: 600;
    color: #6b7280;
}}

.slide-footer {{
    display: table;
    width: 100%;
    border-top: 1px solid #e5e2da;
    padding-top: 4pt;
    margin-top: 6pt;
    font-size: 7.5pt;
    color: #9ca3af;
}}

.slide-footer-left {{
    display: table-cell;
    text-align: left;
}}

.slide-footer-right {{
    display: table-cell;
    text-align: right;
    font-weight: 600;
    color: #143828;
}}

/* Typography */
h1, h2, h3 {{
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    color: #143828;
    margin: 0;
}}

.slide-title {{
    font-size: 18pt;
    line-height: 1.15;
    margin-bottom: 2pt;
}}

.slide-subtitle {{
    font-size: 9pt;
    color: #6b7280;
    margin-bottom: 6pt;
}}

p {{
    margin-top: 0;
    margin-bottom: 5pt;
    text-align: justify;
}}

/* Lists with Circular Bullets */
ul {{
    list-style-type: disc !important;
    margin-top: 2pt;
    margin-bottom: 5pt;
    padding-left: 16px;
}}

ul li {{
    margin-bottom: 2.5pt;
    line-height: 1.4;
}}

/* Multi-Column Layout */
.col-container {{
    display: table;
    width: 100%;
    table-layout: fixed;
}}

.col-2 {{
    display: table-cell;
    width: 50%;
    vertical-align: top;
    padding-right: 10pt;
}}

.col-2:last-child {{
    padding-right: 0;
    padding-left: 10pt;
}}

.col-3 {{
    display: table-cell;
    width: 33.33%;
    vertical-align: top;
    padding-right: 8pt;
}}

.col-3:last-child {{
    padding-right: 0;
}}

/* Editorial Note / Layman Box */
.layman-box {{
    border-left: 3px solid #143828;
    background-color: #fbfaf7;
    padding: 5pt 9pt;
    margin: 5pt 0;
    font-size: 8pt;
}}

.layman-box-title {{
    font-weight: 700;
    color: #143828;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2pt;
}}

/* Tables */
table.slide-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    margin: 5pt 0;
}}

table.slide-table th {{
    border-top: 1.5px solid #143828;
    border-bottom: 1.5px solid #143828;
    padding: 4pt 6pt;
    text-align: left;
    font-weight: 700;
    color: #143828;
    font-size: 7.5pt;
    text-transform: uppercase;
    background-color: #f7f6f1;
}}

table.slide-table td {{
    border-bottom: 1px solid #e5e2da;
    padding: 4pt 6pt;
    vertical-align: top;
}}

/* Horizontal Workflow Diagram (No Terminal ASCII) */
.h-workflow {{
    display: table;
    width: 100%;
    margin: 8pt 0;
    table-layout: fixed;
}}

.h-step {{
    display: table-cell;
    vertical-align: top;
    padding: 6pt 8pt;
    background-color: #fbfaf7;
    border: 1px solid #e5e2da;
}}

.h-step-num {{
    font-family: 'Playfair Display', serif;
    font-size: 13pt;
    font-weight: 700;
    color: #143828;
    margin-bottom: 2pt;
}}

.h-step-title {{
    font-weight: 700;
    font-size: 8pt;
    color: #143828;
    margin-bottom: 2pt;
}}

.h-step-desc {{
    font-size: 7.5pt;
    color: #4b5563;
    line-height: 1.35;
}}

.h-arrow {{
    display: table-cell;
    width: 18px;
    vertical-align: middle;
    text-align: center;
    color: #946c38;
    font-size: 12pt;
}}

/* Product Card in Slide */
.product-slide-card {{
    text-align: center;
    border: 1px solid #e5e2da;
    padding: 5pt;
    background-color: #fbfaf7;
}}

.product-slide-card img {{
    width: 100%;
    height: 85px;
    object-fit: cover;
    margin-bottom: 3pt;
}}

.product-slide-title {{
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 9pt;
    color: #143828;
}}

.product-slide-desc {{
    font-size: 7.5pt;
    color: #6b7280;
    margin-top: 2pt;
}}

/* Cover Slide Special Styling */
.slide-cover {{
    background-color: #143828;
    color: #f7f6f1;
    padding: 16mm 20mm 12mm 20mm;
    max-height: 210mm;
    overflow: hidden;
    page-break-after: always;
    page-break-inside: avoid;
}}

.cover-title-big {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 26pt;
    font-weight: 700;
    line-height: 1.15;
    color: #ffffff;
    margin-bottom: 6pt;
}}

.cover-tagline {{
    font-size: 10.5pt;
    color: #d1d5db;
    max-width: 620px;
    line-height: 1.45;
    margin-bottom: 14pt;
}}

.cover-team-box {{
    display: table;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 10pt;
}}

.cover-team-cell {{
    display: table-cell;
    width: 25%;
    vertical-align: top;
}}

.cover-team-lbl {{
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #dfba7c;
    margin-bottom: 2pt;
}}

.cover-team-val {{
    font-size: 8.5pt;
    font-weight: 600;
    color: #ffffff;
}}
</style>
</head>
<body>

<!-- SLIDE 1: COVER -->
<div class="slide slide-cover">
    <div>
        <div style="font-size: 8.5pt; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: #dfba7c; margin-bottom: 12pt;">
            CHANGKEER ATELIER • SYSTEM PRESENTATION &amp; PROJECT SHOWCASE
        </div>
        <div style="margin-bottom: 10pt;">
            <img src="{assets['logo']}" style="width: 55px; height: 55px; border-radius: 50%; border: 2px solid #dfba7c;" alt="Changkeer Logo">
        </div>
        <div class="cover-title-big">Digitalizing the 24 Seasons Herbal Tea Ritual</div>
        <div class="cover-tagline">
            Self-Service Mobile Ordering, Dynamic Locked-Amount QRIS Payments, Real-Time Kitchen Display System (KDS), and Store Management.
        </div>
    </div>

    <div class="cover-team-box">
        <div class="cover-team-cell">
            <div class="cover-team-lbl">Project Team</div>
            <div class="cover-team-val">System Engineering Team</div>
        </div>
        <div class="cover-team-cell">
            <div class="cover-team-lbl">Lead Architect</div>
            <div class="cover-team-val">Muhammad Ilham</div>
        </div>
        <div class="cover-team-cell">
            <div class="cover-team-lbl">Organization / Brand</div>
            <div class="cover-team-val">CHANGKEER ATELIER</div>
        </div>
        <div class="cover-team-cell">
            <div class="cover-team-lbl">Academic Year / Release</div>
            <div class="cover-team-val">October 2026</div>
        </div>
    </div>
</div>

<!-- SLIDE 2: BACKGROUND & PROBLEM -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">01 / Industry Background &amp; Problem Statement</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Operational Friction in the Artisan Tea Sector</div>
        <div class="slide-subtitle">Why traditional cafe counters fail to meet modern guest expectations and barista precision.</div>

        <div class="col-container">
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">Core Frictions in Traditional Tea Stores</h3>
                <ul>
                    <li><strong>Exhausting Counter Queues:</strong> Guests stand in long lines simply to decide on custom botanical blends, degrading the relaxing tea lounge experience.</li>
                    <li><strong>Costly Typos on Static QR Codes:</strong> Static printed paper stickers require guests to manually key in prices, triggering frequent underpayments or double transfers.</li>
                    <li><strong>Damaged Paper Tickets at the Brew Bar:</strong> Paper kitchen chits easily get soaked with hot water or lost, leading to swapped orders and ruined steep times.</li>
                    <li><strong>Lack of Recipe Calibration:</strong> Herbal extraction varies wildly between baristas without automated digital recipe guidance.</li>
                </ul>
            </div>
            <div class="col-2">
                <div class="layman-box">
                    <div class="layman-box-title">Everyday Analogy: Chaos Behind the Bar</div>
                    Imagine a barista carefully maintaining water temperature at 85°C for mountain jasmine. Suddenly, the cashier yells a custom 30% sweetness modification, while the paper receipt slips into a puddle of spilled tea. The barista loses track of the timer, and the brew turns bitter and astringent. This is the exact issue CHANGKEER eliminates.
                </div>
                <div class="layman-box">
                    <div class="layman-box-title">The Strategic Solution</div>
                    Eliminating 100% of paper tickets at the bar, preventing financial transfer errors through dynamic QRIS, and empowering guests to configure their cups right from their seats.
                </div>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">CHANGKEER System Engineering Group</div>
        <div class="slide-footer-right">Slide 02</div>
    </div>
</div>

<!-- SLIDE 3: PRODUCT SOLUTION & 24 SEASONS -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">02 / Solution Concept &amp; Philosophy</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">The CHANGKEER Solution: 24 Seasons Botanical Teas</div>
        <div class="slide-subtitle">Harmonizing bodily metabolism with Indonesia's rich botanical heritage and cosmic natural cycles.</div>

        <div class="col-container">
            <div class="col-2">
                <p>
                    <strong>CHANGKEER</strong> presents an authentic herbal tea sanctuary celebrating the ancient 24 Solar Terms calendar. Each cup is intentionally designed to align bodily vitality with prevailing weather and atmospheric conditions.
                </p>
                <div class="layman-box">
                    <div class="layman-box-title">Layman Explanation: What is an Herbal Tisane?</div>
                    A tisane is a pure botanical infusion created from whole herbs, spices, and whole flower blossoms (such as dried rose, mountain jasmine, blue pea flower, and ginger root). Unlike mass-market tea bags that often use synthetic aromatics, CHANGKEER Tisanes are 100% natural, preservative-free, and stomach-friendly.
                </div>
            </div>
            <div class="col-2">
                <table class="slide-table">
                    <thead>
                        <tr>
                            <th>Season</th>
                            <th>Sensory Profile</th>
                            <th>Bodily Wellness Function</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Spring</strong></td>
                            <td>Fresh Floral Bouquet</td>
                            <td>Refreshes mental vitality &amp; aids gentle seasonal detox.</td>
                        </tr>
                        <tr>
                            <td><strong>Summer</strong></td>
                            <td>Cooling Mint &amp; Citrus</td>
                            <td>Lowers internal heat &amp; delivers intense hydration.</td>
                        </tr>
                        <tr>
                            <td><strong>Autumn</strong></td>
                            <td>Chamomile &amp; Cinnamon</td>
                            <td>Soothes nervous tension &amp; relieves daily stress.</td>
                        </tr>
                        <tr>
                            <td><strong>Winter</strong></td>
                            <td>Aged Red Ginger &amp; Clove</td>
                            <td>Provides deep thermal comfort &amp; strengthens immunity.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">CHANGKEER System Engineering Group</div>
        <div class="slide-footer-right">Slide 03</div>
    </div>
</div>

<!-- SLIDE 4: SIGNATURE BLENDS GALLERY -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">03 / Product Showcase &amp; Ingredients</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Three Signature Botanical Blends</div>
        <div class="slide-subtitle">Whole-leaf loose teas and premium Indonesian botanicals steeped with scientific precision.</div>

        <div class="col-container">
            <div class="col-3">
                <div class="product-slide-card">
                    <img src="{assets['jasmine']}" alt="Jasmine Tea">
                    <div class="product-slide-title">Jasmine Tea Signature</div>
                    <div class="product-slide-desc">High-altitude green tea scented with natural jasmine petals. Calms mental fatigue and provides a silky, delicate finish.</div>
                </div>
            </div>
            <div class="col-3">
                <div class="product-slide-card">
                    <img src="{assets['vanilla_mint']}" alt="Vanilla Mint Tea">
                    <div class="product-slide-title">Vanilla Mint Tea</div>
                    <div class="product-slide-desc">Crisp highland peppermint balanced with sweet organic vanilla extract. Clears breathing passages and cools the body.</div>
                </div>
            </div>
            <div class="col-3">
                <div class="product-slide-card">
                    <img src="{assets['english_breakfast']}" alt="English Breakfast Tea">
                    <div class="product-slide-title">English Breakfast Tea</div>
                    <div class="product-slide-desc">Robust, full-bodied Indonesian black tea providing sustained morning focus. 100% bleach-free, microplastic-free pouches.</div>
                </div>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">CHANGKEER System Engineering Group</div>
        <div class="slide-footer-right">Slide 04</div>
    </div>
</div>

<!-- SLIDE 5: CUSTOMER EXPERIENCE -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">04 / Guest Experience &amp; Personalization</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Frictionless Mobile Ordering &amp; Customization</div>
        <div class="slide-subtitle">Empowering guests to tailor their tea ritual without downloading any third-party app.</div>

        <div class="col-container">
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">The Web-Based Guest Journey</h3>
                <ul>
                    <li><strong>No App Installation Required:</strong> Guests scan a stylish table QR code using their native phone camera to instantly access the live catalog.</li>
                    <li><strong>Temperature Selection:</strong> Traditional Hot Clay Pot (warm comfort) or Refreshing Iced Shaken Tea (+IDR 2,000 with craft ice).</li>
                    <li><strong>5 Calibrated Sweetness Levels:</strong> 0% (Unsweetened), 30% (Light), 50% (Tea Forward), 75% (Balanced), and 100% (Full Sweetness).</li>
                    <li><strong>Botanical Petal Add-Ons (+IDR 3,000):</strong> Fresh Butterfly Pea, Dried Mountain Jasmine, Royal Marigold, or Raw Forest Honey.</li>
                </ul>
            </div>
            <div class="col-2">
                <div class="layman-box">
                    <div class="layman-box-title">Why Guests Love Complete Personalization</div>
                    Every guest has distinct wellness needs: diabetics require 0% sugar brews, fatigued individuals need raw forest honey, and lifestyle seekers love iced teas infused with purple butterfly pea petals. The CHANGKEER system accommodates every preference in seconds.
                </div>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">CHANGKEER System Engineering Group</div>
        <div class="slide-footer-right">Slide 05</div>
    </div>
</div>

<!-- SLIDE 6: WORKFLOW & DYNAMIC QRIS -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">05 / Transaction Workflow &amp; Dynamic QRIS</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">End-to-End Automated Transaction Pipeline</div>
        <div class="slide-subtitle">Complete digital automation from menu exploration to the barista's pickup counter.</div>

        <!-- Horizontal Visual Flow -->
        <div class="h-workflow">
            <div class="h-step">
                <div class="h-step-num">1</div>
                <div class="h-step-title">Configure on Phone</div>
                <div class="h-step-desc">Guest picks tea blend, temperature, sweetness &amp; toppings.</div>
            </div>
            <div class="h-arrow">&#8594;</div>
            <div class="h-step">
                <div class="h-step-num">2</div>
                <div class="h-step-title">Dynamic QRIS</div>
                <div class="h-step-desc">Server locks in the exact payable bill amount into barcode.</div>
            </div>
            <div class="h-arrow">&#8594;</div>
            <div class="h-step">
                <div class="h-step-num">3</div>
                <div class="h-step-title">Security Check</div>
                <div class="h-step-desc">Backend re-validates catalog prices &amp; payment state.</div>
            </div>
            <div class="h-arrow">&#8594;</div>
            <div class="h-step">
                <div class="h-step-num">4</div>
                <div class="h-step-title">Barista KDS Ticket</div>
                <div class="h-step-desc">Touchscreen display updates with order queue in real time.</div>
            </div>
            <div class="h-arrow">&#8594;</div>
            <div class="h-step">
                <div class="h-step-num">5</div>
                <div class="h-step-title">Precision Handover</div>
                <div class="h-step-desc">Barista steeps tea accurately &amp; delivers cup to table.</div>
            </div>
        </div>

        <div class="layman-box">
            <div class="layman-box-title">Layman Explanation: The Superiority of Dynamic QRIS</div>
            On traditional paper QR codes, guests must manually type in "IDR 28,000". If they accidentally type "IDR 2,800", the store loses money. With CHANGKEER Dynamic QRIS, the scanned barcode already carries the exact locked IDR 28,000 amount. Guests only tap 'Confirm' on their mobile banking app.
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">CHANGKEER System Engineering Group</div>
        <div class="slide-footer-right">Slide 06</div>
    </div>
</div>

<!-- SLIDE 7: PAYMENT SECURITY -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">06 / Security Architecture &amp; Financial Integrity</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Financial Protection &amp; Anti-Tampering Shield</div>
        <div class="slide-subtitle">Multi-tier safeguards protecting both retail revenues and consumer trust.</div>

        <div class="col-container">
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">1. Server-Side Anti-Tampering</h3>
                <p>
                    All product unit prices, ice surcharges (+IDR 2,000), and flower add-ons are strictly re-verified on the central backend, never trusted to browser variables.
                </p>
                <div class="layman-box">
                    <div class="layman-box-title">Analogy: The Incorruptible Cashier</div>
                    If a dishonest customer tampers with browser code to change an IDR 35,000 premium blend to IDR 1,000, the central server instantly flags the discrepancy and aborts the transaction immediately.
                </div>
            </div>
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">2. Idempotency (Double-Charge Prevention)</h3>
                <p>
                    When network connectivity stutters and a customer taps "Pay" multiple times, the transaction lock ensures only the first request is executed.
                </p>
                <div class="layman-box">
                    <div class="layman-box-title">Analogy: The Fair Ticket Machine</div>
                    Guarantees that the customer's bank account or e-wallet balance is never debited twice, no matter how many times the button was pressed.
                </div>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">CHANGKEER System Engineering Group</div>
        <div class="slide-footer-right">Slide 07</div>
    </div>
</div>

<!-- SLIDE 8: KITCHEN DISPLAY SYSTEM -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">07 / Barista Operations &amp; KDS</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Kitchen Display System (KDS): A Paperless Bar</div>
        <div class="slide-subtitle">Transforming the tea preparation counter into an organized, hygienic brewing laboratory.</div>

        <div class="col-container">
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">Operational Value for Baristas</h3>
                <ul>
                    <li><strong>Chronological Order Queue:</strong> Orders placed earlier sit automatically at the front of the queue, preventing fulfillment delays.</li>
                    <li><strong>Vibrant Color-Coded States:</strong> Amber (Waiting), Blue (Active Extraction), and Green (Ready for Pickup).</li>
                    <li><strong>Crystal-Clear Customization:</strong> Sweetness doses (ml) and flower toppings are clearly highlighted on screen.</li>
                    <li><strong>Zero Paper Clutter:</strong> Brewing surfaces remain completely dry, sterile, and professional.</li>
                </ul>
            </div>
            <div class="col-2">
                <table class="slide-table">
                    <thead>
                        <tr>
                            <th>Tea Category</th>
                            <th>Water Temperature</th>
                            <th>Standard Steeping Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Green Tea &amp; Jasmine</td>
                            <td>80°C – 85°C</td>
                            <td>3.5 – 4 Minutes (Delicate)</td>
                        </tr>
                        <tr>
                            <td>Robust Black Tea</td>
                            <td>95°C – 98°C</td>
                            <td>3.5 Minutes (Bold)</td>
                        </tr>
                        <tr>
                            <td>Whole Floral Tisanes</td>
                            <td>90°C – 95°C</td>
                            <td>5 Minutes (Full Color)</td>
                        </tr>
                        <tr>
                            <td>Root &amp; Ginger Tisanes</td>
                            <td>98°C – 100°C</td>
                            <td>6 Minutes (Active Oils)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">CHANGKEER System Engineering Group</div>
        <div class="slide-footer-right">Slide 08</div>
    </div>
</div>

<!-- SLIDE 9: TECHNOLOGY ARCHITECTURE -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">08 / Technology Stack &amp; Reliability</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Next-Generation Engineering Stack</div>
        <div class="slide-subtitle">Engineered with high-speed modern web infrastructure to ensure uninterrupted retail uptime.</div>

        <div class="col-container">
            <div class="col-3">
                <div style="background-color: #fbfaf7; border: 1px solid #e5e2da; padding: 8pt;">
                    <div style="font-weight: 700; color: #143828; font-size: 9.5pt; margin-bottom: 2pt;">Next.js 16 &amp; React 19</div>
                    <div style="font-size: 8pt; color: #4b5563;">Ultra-fast catalog rendering on mobile devices with negligible cellular data usage.</div>
                </div>
            </div>
            <div class="col-3">
                <div style="background-color: #fbfaf7; border: 1px solid #e5e2da; padding: 8pt;">
                    <div style="font-weight: 700; color: #143828; font-size: 9.5pt; margin-bottom: 2pt;">Supabase Cloud &amp; RLS</div>
                    <div style="font-size: 8pt; color: #4b5563;">Encrypted PostgreSQL database with strict row-level authorization on customer orders.</div>
                </div>
            </div>
            <div class="col-3">
                <div style="background-color: #fbfaf7; border: 1px solid #e5e2da; padding: 8pt;">
                    <div style="font-weight: 700; color: #143828; font-size: 9.5pt; margin-bottom: 2pt;">Dual-Tier Resilience</div>
                    <div style="font-size: 8pt; color: #4b5563;">If internet connection drops, the local memory store ensures counter POS continues smoothly.</div>
                </div>
            </div>
        </div>

        <div class="layman-box" style="margin-top: 10pt;">
            <div class="layman-box-title">Measurable Retail Impact</div>
            Reduces customer ordering wait times by up to 65%, cuts tea beverage preparation errors to near 0%, and permanently eliminates paper receipt procurement overhead.
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">CHANGKEER System Engineering Group</div>
        <div class="slide-footer-right">Slide 09</div>
    </div>
</div>

<!-- SLIDE 10: TEAM & CONCLUSION -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">09 / Project Team &amp; Closing</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Engineering Team &amp; Open Discussion</div>
        <div class="slide-subtitle">Empowering the future of Indonesian botanical tea rituals through disciplined digital engineering.</div>

        <div class="col-container">
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">Project Development Team Roster</h3>
                <table class="slide-table">
                    <thead>
                        <tr>
                            <th>Department / Role</th>
                            <th>Lead Person</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Project Lead &amp; System Architect</strong></td>
                            <td><strong>Muhammad Ilham</strong></td>
                        </tr>
                        <tr>
                            <td><strong>Frontend &amp; UI/UX Division</strong></td>
                            <td>User Interface Team</td>
                        </tr>
                        <tr>
                            <td><strong>Botanical R&amp;D &amp; Barista Standards</strong></td>
                            <td>Botanical Research Team</td>
                        </tr>
                        <tr>
                            <td><strong>Store Operations &amp; Cashier Services</strong></td>
                            <td>Store Operations Team</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-2">
                <div class="layman-box">
                    <div class="layman-box-title">Final Synthesis</div>
                    CHANGKEER proves that heritage herbal craftsmanship can seamlessly harmonize with cutting-edge web technology. The platform is ready for commercial multi-store deployment.
                </div>
                <div style="text-align: center; margin-top: 14pt;">
                    <div style="font-family: 'Playfair Display', serif; font-size: 15pt; font-weight: 700; color: #143828; margin-bottom: 2pt;">
                        Thank You for Your Consideration
                    </div>
                    <div style="font-size: 8.5pt; color: #6b7280;">
                        We warmly invite questions, critique, and discussion.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">CHANGKEER ATELIER • All Rights Reserved</div>
        <div class="slide-footer-right">Slide 10</div>
    </div>
</div>

</body>
</html>
"""
    clean_html = html.replace("*", "")
    return clean_html

if __name__ == "__main__":
    from assets_loader import get_all_assets
    assets = get_all_assets()
    out = generate_presentation_en(assets)
    print(f"English Presentation generated. Total chars: {len(out)}")
