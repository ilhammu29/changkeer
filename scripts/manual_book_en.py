#!/usr/bin/env python3
"""
manual_book_en.py - English Manual Book (A4 Portrait)
Featuring:
- Official Web Logo (logo_new.png)
- The 5 Co-Founders from the website About page
- Complete 24 Seasonal Products Catalog with compact, simple images
- High Contrast, Pristine Professional Typography, Zero AI-slop, No Badges, Round Bullets
- Zero mention of user's personal name
- Zero mention of OXID
- Zero asterisks
"""

def generate_manual_book_en(assets: dict) -> str:
    founders = assets.get("founders", [])
    solar_terms = assets.get("solar_terms", [])
    logo_b64 = assets.get("logo", "")

    # Group the 24 products by season
    seasons = [
        {"id": "spring", "name": "Spring Blends (Terms 01–06)", "desc": "Delicate, floral, and grassy infusions matching crisp mornings and natural renewal."},
        {"id": "summer", "name": "Summer Blends (Terms 07–12)", "desc": "Refreshing citrus, cooling herbs, and hydrating tisanes to beat tropical dry heat."},
        {"id": "autumn", "name": "Autumn Blends (Terms 13–18)", "desc": "Golden osmanthus, whole chamomile, and warming roots for contemplative rainy evenings."},
        {"id": "winter", "name": "Winter Blends (Terms 19–24)", "desc": "Aged red ginger root, Maluku cloves, and raw forest honey for deep thermal vitality."}
    ]

    # Generate 24 products HTML
    catalog_html = ""
    for s in seasons:
        s_items = [b for b in solar_terms if b.get("season") == s["id"]]
        catalog_html += f"""
        <div style="margin-top: 14pt; page-break-inside: avoid;">
            <div style="font-family: 'Playfair Display', serif; font-size: 13pt; font-weight: 700; color: #143828; border-bottom: 1px solid #143828; padding-bottom: 3pt; margin-bottom: 6pt;">
                {s['name']}
            </div>
            <p style="font-size: 8.5pt; color: #4a5568; margin-bottom: 8pt;">{s['desc']}</p>
            <div style="display: table; width: 100%; table-layout: fixed;">
        """
        for row_idx in range(0, len(s_items), 2):
            catalog_html += '<div style="display: table-row;">'
            for col_idx in range(2):
                if row_idx + col_idx < len(s_items):
                    item = s_items[row_idx + col_idx]
                    ingr_str = ", ".join(item.get("ingredients", []))
                    catalog_html += f"""
                    <div style="display: table-cell; width: 50%; vertical-align: top; padding: 6pt; border: 1px solid #e2e8f0; background: #ffffff;">
                        <div style="display: table; width: 100%;">
                            <div style="display: table-cell; width: 58px; vertical-align: top;">
                                <img src="{item.get('thumb_b64', '')}" style="width: 52px; height: 52px; object-fit: cover; border: 1px solid #cbd5e1; display: block;" alt="{item.get('term')}">
                            </div>
                            <div style="display: table-cell; vertical-align: top; padding-left: 8pt;">
                                <div style="font-family: 'Playfair Display', serif; font-size: 9.5pt; font-weight: 700; color: #143828;">
                                    {item.get('term')} <span style="font-family: sans-serif; font-size: 8.5pt; color: #946c38;">({item.get('termChinese')})</span>
                                </div>
                                <div style="font-size: 8pt; font-weight: 600; color: #946c38; text-transform: uppercase;">
                                    {item.get('blend')} • Hot {item.get('hotPrice')} / Ice {item.get('icedPrice')}
                                </div>
                                <div style="font-size: 8pt; color: #2d3748; margin-top: 2pt; line-height: 1.35;">
                                    <strong>Ingredients:</strong> {ingr_str}
                                </div>
                                <div style="font-size: 7.5pt; color: #4a5568; margin-top: 1pt; font-style: italic;">
                                    "{item.get('note')}"
                                </div>
                            </div>
                        </div>
                    </div>
                    """
                else:
                    catalog_html += '<div style="display: table-cell; width: 50%;"></div>'
            catalog_html += '</div>'
        catalog_html += '</div></div>'

    # Founders Table Rows
    founders_rows = ""
    for f in founders:
        founders_rows += f"""
        <tr>
            <td style="text-align: center; font-weight: 700; color: #143828;">{f['num']}</td>
            <td><strong>{f['name']}</strong></td>
            <td>{f['role']}</td>
            <td>{f['focus_en']}</td>
        </tr>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CHANGKEER ATELIER — OPERATIONS &amp; SYSTEM MANUAL BOOK</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

@page {{
    size: A4 portrait;
    margin: 20mm 18mm 20mm 18mm;
    @top-left {{
        content: "CHANGKEER ATELIER — OPERATIONS &amp; SYSTEM MANUAL BOOK";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #4a5568;
    }}
    @top-right {{
        content: "OFFICIAL EDITION 2026";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 700;
        color: #946c38;
    }}
    @bottom-left {{
        content: "Board of Founders CHANGKEER • All Rights Reserved";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        color: #718096;
    }}
    @bottom-right {{
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 700;
        color: #143828;
    }}
}}

@page:first {{
    margin: 0;
    @top-left {{ content: none; }}
    @top-right {{ content: none; }}
    @bottom-left {{ content: none; }}
    @bottom-right {{ content: none; }}
}}

* {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}}

body {{
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 9.5pt;
    line-height: 1.6;
    color: #1a202c;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
}}

h1, h2, h3, h4 {{
    color: #143828;
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    margin-top: 0;
    page-break-after: avoid;
}}

h1 {{
    font-size: 19pt;
    line-height: 1.25;
    margin-bottom: 8pt;
    border-bottom: 2px solid #143828;
    padding-bottom: 5pt;
}}

h2 {{
    font-size: 13pt;
    line-height: 1.3;
    margin-top: 16pt;
    margin-bottom: 6pt;
    color: #143828;
}}

h3 {{
    font-size: 10.5pt;
    line-height: 1.35;
    margin-top: 12pt;
    margin-bottom: 4pt;
    color: #946c38;
}}

p {{
    margin-top: 0;
    margin-bottom: 7pt;
    text-align: justify;
    color: #2d3748;
}}

ul {{
    list-style-type: disc !important;
    margin-top: 3pt;
    margin-bottom: 8pt;
    padding-left: 18px;
}}

ul li {{
    margin-bottom: 3pt;
    line-height: 1.5;
    color: #2d3748;
}}

ol {{
    margin-top: 3pt;
    margin-bottom: 8pt;
    padding-left: 18px;
}}

ol li {{
    margin-bottom: 3pt;
    line-height: 1.5;
    color: #2d3748;
}}

.section-label {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #946c38;
    margin-bottom: 3pt;
}}

.rule {{
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 14pt 0;
}}

.layman-box {{
    border-left: 3.5px solid #143828;
    background-color: #f8fafc;
    border-right: 1px solid #e2e8f0;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    padding: 8pt 11pt;
    margin: 9pt 0;
    font-size: 8.5pt;
}}

.layman-box-title {{
    font-weight: 700;
    color: #143828;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 3pt;
}}

table.editorial-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
}}

table.editorial-table th {{
    border-top: 2px solid #143828;
    border-bottom: 1.5px solid #143828;
    padding: 6pt 8pt;
    text-align: left;
    font-weight: 700;
    color: #143828;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #f1f5f9;
}}

table.editorial-table td {{
    border-bottom: 1px solid #e2e8f0;
    padding: 5.5pt 8pt;
    vertical-align: top;
    color: #2d3748;
}}

table.editorial-table tr:nth-child(even) td {{
    background-color: #f8fafc;
}}

/* Workflow Step Box */
.workflow-step {{
    display: table;
    width: 100%;
    margin-bottom: 6pt;
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    padding: 6pt 10pt;
    page-break-inside: avoid;
}}

.workflow-num {{
    display: table-cell;
    width: 28px;
    vertical-align: middle;
    font-family: 'Playfair Display', serif;
    font-size: 15pt;
    font-weight: 700;
    color: #143828;
}}

.workflow-content {{
    display: table-cell;
    vertical-align: middle;
    padding-left: 8pt;
}}

.workflow-title {{
    font-weight: 700;
    color: #143828;
    font-size: 9pt;
    margin-bottom: 1pt;
}}

.workflow-desc {{
    font-size: 8pt;
    color: #4a5568;
    line-height: 1.35;
}}

.workflow-arrow {{
    text-align: center;
    color: #946c38;
    font-size: 12pt;
    line-height: 1;
    margin: -3pt 0 3pt 0;
}}

/* Cover Page */
.cover-page {{
    page-break-after: always;
    height: 100vh;
    padding: 32mm 22mm 24mm 22mm;
    background-color: #143828;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
}}

.cover-header {{
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    padding-bottom: 14pt;
}}

.cover-brand-title {{
    font-size: 10pt;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #dfba7c;
}}

.cover-main-title {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 30pt;
    font-weight: 700;
    line-height: 1.15;
    color: #ffffff;
    margin-bottom: 10pt;
}}

.cover-subtitle {{
    font-size: 11pt;
    line-height: 1.55;
    color: #e2e8f0;
    max-width: 520px;
    margin-bottom: 20pt;
}}

.cover-meta-grid {{
    display: table;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    padding-top: 12pt;
}}

.cover-meta-cell {{
    display: table-cell;
    width: 25%;
    vertical-align: top;
}}

.cover-meta-label {{
    font-size: 7pt;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #dfba7c;
    margin-bottom: 3pt;
}}

.cover-meta-val {{
    font-size: 8.5pt;
    font-weight: 600;
    color: #ffffff;
}}

.cover-footer {{
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 10pt;
    font-size: 8pt;
    color: #cbd5e1;
    display: table;
    width: 100%;
}}

.page-break {{
    page-break-after: always;
}}
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
    <div class="cover-header">
        <div class="cover-brand-title">CHANGKEER ATELIER • OFFICIAL SYSTEM &amp; OPERATIONAL DOCUMENT</div>
    </div>

    <div>
        <div style="margin-bottom: 12pt;">
            <img src="{logo_b64}" style="width: 70px; height: 70px; border-radius: 50%; border: 2.5px solid #dfba7c; background: #ffffff;" alt="Changkeer Web Logo">
        </div>
        <div class="cover-main-title">Operations &amp; System Manual Book</div>
        <div class="cover-subtitle">
            Comprehensive Standard Operating Procedures (SOP) for 24 Seasons Herbal Tea Extraction, Self-Service Mobile Ordering, Dynamic QRIS Payments, Kitchen Display System (KDS), and Store Governance.
        </div>

        <div class="cover-meta-grid">
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Document ID</div>
                <div class="cover-meta-val">CK-SOP-2026-EN3</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Founding Body</div>
                <div class="cover-meta-val">5 Co-Founders</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Enterprise</div>
                <div class="cover-meta-val">CHANGKEER ATELIER</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Release Date</div>
                <div class="cover-meta-val">October 2026</div>
            </div>
        </div>
    </div>

    <div class="cover-footer">
        <div style="display: table-cell; text-align: left;">CHANGKEER ATELIER • Artisan Herbal Tea &amp; Botanical Blends</div>
        <div style="display: table-cell; text-align: right;">Store Operations &amp; Technical Edition</div>
    </div>
</div>

<!-- FOUNDERS PAGE & TABLE OF CONTENTS -->
<div class="page-break">
    <div class="section-label">Governance &amp; Authority Sheet</div>
    <h1>Board of Founders &amp; Organization Structure</h1>

    <p>
        This Operations Manual is the authoritative operational guideline for all retail teams, tea specialists (baristas), counter cashiers, and technical administrators across CHANGKEER ATELIER. Officially ratified by the five founders of CHANGKEER.
    </p>

    <h2>The Board of Founders (5 Co-Founders)</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 8%;">No</th>
                <th style="width: 32%;">Founder Name</th>
                <th style="width: 18%;">Title</th>
                <th>Strategic Focus &amp; Core Responsibility</th>
            </tr>
        </thead>
        <tbody>
            {founders_rows}
        </tbody>
    </table>

    <h2>Table of Contents</h2>
    <ul style="line-height: 1.7; margin-top: 8pt;">
        <li><strong>Chapter 1:</strong> Understanding CHANGKEER &amp; The 24 Solar Terms Philosophy</li>
        <li><strong>Chapter 2:</strong> Digital Architecture &amp; System Reliability Infrastructure</li>
        <li><strong>Chapter 3:</strong> Complete 24 Seasonal Blends Catalog, Ingredients &amp; Customizations</li>
        <li><strong>Chapter 4:</strong> Transaction Flow, Dynamic QRIS &amp; Financial Security</li>
        <li><strong>Chapter 5:</strong> Barista Standard Operating Procedures (SOP) at the Brew Bar</li>
        <li><strong>Chapter 6:</strong> Cashier Operations &amp; Daily Financial Reconciliation</li>
        <li><strong>Chapter 7:</strong> Store Administration &amp; Central Management Panel (Admin Dashboard)</li>
        <li><strong>Chapter 8:</strong> Practical Layman Glossary &amp; Rapid Operational Troubleshooting</li>
    </ul>

    <div class="layman-box">
        <div class="layman-box-title">Document Readability &amp; Layman Accessibility</div>
        This handbook is structured in direct, lucid prose free from obscure jargon. Every technical software mechanism and specialized botanical brewing parameter is accompanied by intuitive real-world analogies to ensure effortless comprehension by evaluators and retail team members alike.
    </div>
</div>

<!-- CHAPTER 1 -->
<div class="page-break">
    <div class="section-label">Chapter 01 • Concept &amp; Brand Vision</div>
    <h1>Understanding CHANGKEER &amp; The 24 Seasons</h1>

    <h2>1.1 What is CHANGKEER ATELIER?</h2>
    <p>
        <strong>CHANGKEER</strong> is a contemporary artisan herbal tea atelier that combines Indonesian botanical riches with the ancient wisdom of the 24 Solar Terms. Distinct from noisy commercial coffee venues or uncalibrated traditional herbal stalls, CHANGKEER offers a peaceful sanctuary where mindful guests can enjoy natural, precision-crafted, health-restorative infusions.
    </p>

    <div class="layman-box">
        <div class="layman-box-title">Layman Explanation: Herbal Tisanes vs Commercial Teas</div>
        Many assume all teas are identical. In reality, mass-market tea bags often rely on industrial black tea dust enhanced with synthetic flavorings. In contrast, <strong>CHANGKEER Herbal Tisanes</strong> are brewed purely from whole botanicals, premium herbs, and fresh petals—such as wild jasmine, butterfly pea, red ginger, and spearmint—completely free of synthetic chemicals and harsh gastric irritants.
    </div>

    <h2>1.2 Why Harmonize Brews with the 24 Solar Terms?</h2>
    <p>
        Human metabolism naturally responds to atmospheric shifts throughout the year. During scorching summer days, the body craves internal cooling and cellular hydration. Conversely, in damp or chilly conditions, it requires restorative spices that gently stimulate circulation.
    </p>
    <p>
        CHANGKEER categorizes its blends into four primary seasonal pillars:
    </p>
    <ul>
        <li><strong>Spring (Renewal &amp; Detox):</strong> Gentle floral notes that refresh the senses, support internal cleansing, and awaken vital energy after prolonged fatigue.</li>
        <li><strong>Summer (Cooling &amp; Hydration):</strong> Cooling spearmint, lemongrass, and natural citrus that reduce body heat and quench thirst without sugar spikes.</li>
        <li><strong>Autumn (Balance &amp; Serenity):</strong> Soothing whole chamomile, sweet cinnamon, and licorice root that calm the nervous system and ease mental tension.</li>
        <li><strong>Winter (Warmth &amp; Immunity):</strong> Robust aged red ginger, cloves, and wild forest honey that provide deep thermal comfort and strengthen natural immunity.</li>
    </ul>

    <h2>1.3 The Need for a Self-Service Digital Platform</h2>
    <p>
        Crafting botanical tisanes requires exact steeping durations and strict water temperatures. If baristas are distracted by scribbling paper tickets, calculating change, and memorizing custom sweetness preferences, craft quality inevitably suffers.
    </p>
    <p>
        The CHANGKEER digital ecosystem enables guests to customize their brews directly from their smartphones and pay instantly via dynamic QRIS, allowing baristas behind the bar to focus 100% on precision extraction and tea craftsmanship.
    </p>
</div>

<!-- CHAPTER 2 -->
<div class="page-break">
    <div class="section-label">Chapter 02 • Digital Infrastructure</div>
    <h1>System Architecture &amp; Technology Ecosystem</h1>

    <h2>2.1 How the System Operates Behind the Scenes</h2>
    <p>
        The CHANGKEER software architecture is constructed with modern web standards to deliver instantaneous page loads, high reliability, and robust data protection across customer smartphones, cashier POS stations, and barista touchscreens.
    </p>

    <div class="layman-box">
        <div class="layman-box-title">Everyday Analogy: The Anatomy of CHANGKEER</div>
        Consider the digital system like a physical cafe building:
        <ul>
            <li><strong>Next.js (App Router):</strong> The clean, illuminated glass storefront where customers browse the seasonal menu and configure their cups smoothly without lag.</li>
            <li><strong>Supabase (PostgreSQL Database):</strong> The secure vault and master ledger in the back office, ensuring every order, recipe customization, and payment record is permanently protected.</li>
            <li><strong>Dynamic QRIS:</strong> The smart cashier scanner that automatically locks in the exact bill amount, eliminating manual key-ins and wrong transfers.</li>
            <li><strong>Kitchen Display System (KDS):</strong> The digital order queue display above the brew bar that replaces easily lost paper tickets.</li>
        </ul>
    </div>

    <h2>2.2 Core Technology Stack</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Component</th>
                <th style="width: 25%;">Chosen Technology</th>
                <th>Architectural Benefit &amp; Operational Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Web Application Framework</strong></td>
                <td>Next.js 16 (React 19)</td>
                <td>Instantaneous rendering, minimal bandwidth consumption, and server-side optimizations.</td>
            </tr>
            <tr>
                <td><strong>Programming Language</strong></td>
                <td>TypeScript 5 (Strict Mode)</td>
                <td>Zero-tolerance type safety across order objects, discounts, and financial calculations.</td>
            </tr>
            <tr>
                <td><strong>Design System</strong></td>
                <td>Tailwind CSS</td>
                <td>Ergonomic touch targets, clean typographic scale, and seamless responsive reflow.</td>
            </tr>
            <tr>
                <td><strong>Database &amp; Storage</strong></td>
                <td>Supabase Cloud</td>
                <td>Encrypted data storage with built-in Row-Level Security (RLS) to safeguard records.</td>
            </tr>
            <tr>
                <td><strong>Input Validation</strong></td>
                <td>Zod Schema Validation</td>
                <td>Validating every checkout form and API payload before execution to prevent malformed data.</td>
            </tr>
        </tbody>
    </table>

    <h2>2.3 High-Resilience Dual-Tier Data Storage</h2>
    <p>
        To protect retail operations against cloud network hiccups, CHANGKEER features a dual-tier storage strategy. Active orders are mirrored within an encrypted memory fallback store, ensuring baristas and cashiers can continue taking and fulfilling orders uninterrupted even during intermittent external network delays.
    </p>
</div>

<!-- CHAPTER 3: COMPLETE 24 PRODUCTS CATALOG -->
<div class="page-break">
    <div class="section-label">Chapter 03 • Complete Botanical Catalog</div>
    <h1>Complete Catalog of 24 Seasonal Blends</h1>

    <p>
        Complete visual documentation and botanical specifications for all 24 Seasonal Blends (<em>Solar Terms</em>) curated by the five Co-Founders of CHANGKEER:
    </p>

    {catalog_html}

    <h2>3.2 Standardized Customization Options</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Parameter</th>
                <th style="width: 35%;">Available Options</th>
                <th>Sensory Notes &amp; Pricing Rule</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Serving Temperature</strong></td>
                <td>Hot Tea Pot / Iced Shaken Tea</td>
                <td>Traditional warm steeping pot (standard) or iced shaken tea (+IDR 2,000 using purified craft ice).</td>
            </tr>
            <tr>
                <td><strong>Natural Sweetness Level</strong></td>
                <td>0%, 30%, 50%, 75%, 100%</td>
                <td>Using raw sorghum nectar or wild forest honey. 0% unsweetened, 50% tea-forward, 100% full sweetness.</td>
            </tr>
            <tr>
                <td><strong>Botanical Flower Toppings</strong></td>
                <td>Butterfly Pea, Jasmine, Marigold, Honey (+IDR 3,000)</td>
                <td>Fresh Butterfly Pea (striking purple hue), Dried Jasmine (relaxing aroma), Golden Marigold, or Pure Wild Honey.</td>
            </tr>
        </tbody>
    </table>
</div>

<!-- CHAPTER 4 -->
<div class="page-break">
    <div class="section-label">Chapter 04 • Transaction Workflow &amp; Security</div>
    <h1>Ordering Workflow, Dynamic QRIS &amp; Security</h1>

    <h2>4.1 End-to-End Retail Ordering Pipeline</h2>
    <p>
        The complete digital transaction flow from guest table to barista pickup counter:
    </p>

    <div class="workflow-step">
        <div class="workflow-num">1</div>
        <div class="workflow-content">
            <div class="workflow-title">Guest Explores Menu &amp; Configures Cup on Smartphone</div>
            <div class="workflow-desc">The customer accesses the web catalog, selects their herbal blend, tunes temperature, sweetness level, and botanical petals.</div>
        </div>
    </div>
    <div class="workflow-arrow">&#8595;</div>

    <div class="workflow-step">
        <div class="workflow-num">2</div>
        <div class="workflow-content">
            <div class="workflow-title">System Computes Exact Total &amp; Emits Dynamic QRIS</div>
            <div class="workflow-desc">The server generates a dynamic EMVCo-compliant QRIS barcode with the exact payable amount permanently locked in.</div>
        </div>
    </div>
    <div class="workflow-arrow">&#8595;</div>

    <div class="workflow-step">
        <div class="workflow-num">3</div>
        <div class="workflow-content">
            <div class="workflow-title">Server-Side Verification &amp; Anti-Tampering Check</div>
            <div class="workflow-desc">The backend recalculates every item price against the central catalog, validating vouchers and checking data authenticity.</div>
        </div>
    </div>
    <div class="workflow-arrow">&#8595;</div>

    <div class="workflow-step">
        <div class="workflow-num">4</div>
        <div class="workflow-content">
            <div class="workflow-title">Digital Ticket Instantly Appears on Barista KDS Screen</div>
            <div class="workflow-desc">The brew station monitor updates in real time with the guest order number, table number, and exact recipe specifications.</div>
        </div>
    </div>
    <div class="workflow-arrow">&#8595;</div>

    <div class="workflow-step">
        <div class="workflow-num">5</div>
        <div class="workflow-content">
            <div class="workflow-title">Barista Crafts Tisane &amp; Handover to Customer</div>
            <div class="workflow-desc">The barista steeps tea accurately at calibrated water temperature, taps 'Ready to Serve', and presents the beverage.</div>
        </div>
    </div>

    <h2>4.2 The Superiority of Dynamic QRIS</h2>
    <div class="layman-box">
        <div class="layman-box-title">Layman Explanation: Static Paper QR vs Dynamic QRIS</div>
        <ul>
            <li><strong>Static QR Code (Paper Sticker on Counter):</strong> Acts like a blank donation box. The customer must manually type "IDR 32,500". This invites frequent typos—missing a zero (paying IDR 3,250) or overpaying (paying IDR 325,000). The cashier must manually inspect every customer's phone screen, causing long delays.</li>
            <li><strong>CHANGKEER Dynamic QRIS:</strong> Acts like an automated checkout register. When scanned, the exact IDR 32,500 is already filled in and locked on the customer's mobile banking app. The customer simply confirms payment. Fast, 100% accurate, and completely queue-free.</li>
        </ul>
    </div>

    <h2>4.3 Server-Side Anti-Tampering Security</h2>
    <p>
        Online checkout systems frequently suffer from malicious clients attempting to alter payment amounts in browser storage. On CHANGKEER, price calculations are <strong>never trusted to the customer's device</strong>. Every unit price, iced surcharge, and topping fee is recomputed on the secure backend server. Any attempt to modify amounts aborts the order immediately.
    </p>

    <h2>4.4 Double-Payment Prevention (Idempotency)</h2>
    <p>
        During slow cellular network connections, customers often tap the "Pay" button multiple times in frustration. CHANGKEER implements an idempotency lock: regardless of how many times the submit trigger fires, the backend processes only the initial confirmation, guaranteeing the customer's account is never charged twice.
    </p>
</div>

<!-- CHAPTER 5 -->
<div class="page-break">
    <div class="section-label">Chapter 05 • Barista Standards</div>
    <h1>Barista Standard Operating Procedures (SOP)</h1>

    <h2>5.1 Reading the Kitchen Display System (KDS) Screen</h2>
    <p>
        Every active barista must monitor the touchscreen KDS mounted above the brewing station. Tickets display distinct operational states:
    </p>
    <ul>
        <li><strong>Amber / Yellow Header:</strong> Newly received order (<em>Order Received</em>) awaiting extraction.</li>
        <li><strong>Blue / Indigo Header:</strong> Active brewing process currently underway (<em>Brewing Now</em>).</li>
        <li><strong>Green Header:</strong> Brewing complete and ready for customer pickup (<em>Ready to Serve</em>).</li>
    </ul>

    <h2>5.2 Water Temperature &amp; Extraction Timing Standards</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 30%;">Botanical / Leaf Variety</th>
                <th style="width: 25%;">Optimal Water Temp</th>
                <th style="width: 25%;">Steeping Duration</th>
                <th>Barista Quality Note</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Green Tea &amp; Jasmine</strong></td>
                <td>80°C – 85°C</td>
                <td>3.5 – 4 Minutes</td>
                <td>Never use 100°C boiling water to prevent bitter tannin astringency.</td>
            </tr>
            <tr>
                <td><strong>Black Tea (English Breakfast)</strong></td>
                <td>95°C – 98°C</td>
                <td>3 – 3.5 Minutes</td>
                <td>Keep teapot lid closed to retain volatile essential oils.</td>
            </tr>
            <tr>
                <td><strong>Whole Floral Tisanes</strong></td>
                <td>90°C – 95°C</td>
                <td>Full 5 Minutes</td>
                <td>Ensure petals are fully submerged for vibrant red/amber color extraction.</td>
            </tr>
            <tr>
                <td><strong>Root &amp; Bark Tisanes (Ginger)</strong></td>
                <td>98°C – 100°C</td>
                <td>Full 6 Minutes</td>
                <td>High temperature is required to dissolve active gingerol warming oils.</td>
            </tr>
        </tbody>
    </table>

    <h2>5.3 Precision Sweetness Dispensing Standards</h2>
    <p>
        Baristas must dispense natural sweeteners using calibrated jigger measures:
    </p>
    <ul>
        <li><strong>0% (Unsweetened):</strong> No added sweetener.</li>
        <li><strong>30% (Light Sweetness):</strong> 7.5 ml organic forest honey or raw sorghum nectar.</li>
        <li><strong>50% (Tea Forward):</strong> 12.5 ml organic forest honey or raw sorghum nectar.</li>
        <li><strong>75% (Balanced):</strong> 18 ml organic forest honey or raw sorghum nectar.</li>
        <li><strong>100% (Full Sweetness):</strong> 25 ml organic forest honey or raw sorghum nectar.</li>
    </ul>
</div>

<!-- CHAPTER 6 -->
<div class="page-break">
    <div class="section-label">Chapter 06 • Cashier Procedures</div>
    <h1>Cashier Operations &amp; Daily Reconciliation</h1>

    <h2>6.1 Counter Cashier Responsibilities</h2>
    <p>
        While guests enjoy seamless digital ordering at their tables, counter cashiers remain vital for assisting guests with cash payments, processing debit card transactions on physical EDC terminals, and resolving any edge-case digital inquiries.
    </p>

    <h2>6.2 Payment Troubleshooting Matrix for Cashiers</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Observed Issue</th>
                <th style="width: 35%;">Probable Root Cause</th>
                <th>Immediate Action by Cashier</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Customer Phone Cannot Scan QRIS</strong></td>
                <td>Screen brightness too low or phone camera lens smudged.</td>
                <td>Ask the guest to increase screen brightness to 100%, or verify the order ticket number and complete checkout at the counter register.</td>
            </tr>
            <tr>
                <td><strong>Bank Debited, System Still Pending</strong></td>
                <td>Intermittent inter-bank switching delay during peak banking hours.</td>
                <td>Ask the guest to display their bank debit confirmation receipt. The cashier verifies the merchant name and clicks the manual confirmation button on the cashier dashboard.</td>
            </tr>
            <tr>
                <td><strong>Guest Selected Wrong Blend</strong></td>
                <td>Guest accidentally placed order in haste before double-checking.</td>
                <td>If the brew bar has not started extraction, cancel the ticket on the cashier panel and guide the guest to select the correct seasonal variant.</td>
            </tr>
        </tbody>
    </table>

    <h2>6.3 Refund Procedures</h2>
    <p>
        Refunds are authorized only if a seasonal botanical ingredient becomes unexpectedly unavailable or if an order is cancelled prior to hot water steeping. Approved QRIS refunds are disbursed in physical cash from the register drawer after store supervisor approval.
    </p>

    <h2>6.4 Daily Closing &amp; Financial Reconciliation</h2>
    <p>
        At closing time (22:00 local time), the cashier exports the daily sales summary from the admin dashboard. Cash drawer amounts must align exactly with the recorded cash revenue, while digital QRIS settlement totals are cross-checked against the acquiring merchant statement.
    </p>
</div>

<!-- CHAPTER 7 & 8 -->
<div class="page-break">
    <div class="section-label">Chapter 07 &amp; 08 • Store Governance &amp; Glossary</div>
    <h1>Store Administration &amp; Practical Layman Glossary</h1>

    <h2>7.1 Rapid Botanical Stock Management</h2>
    <p>
        If a specific botanical petal (such as whole chamomile) runs out due to harvest delays, store managers can toggle item visibility in under five seconds via <code>/admin</code> by flipping the status switch to <strong>'Out of Stock'</strong>.
    </p>

    <h2>7.2 Practical Glossary for Non-Technical Evaluators</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Technical Term</th>
                <th style="width: 35%;">Everyday Plain Explanation</th>
                <th>Concrete Example in CHANGKEER Store</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Dynamic QRIS</strong></td>
                <td>A smart payment barcode pre-filled with the exact bill amount so guests do not have to type numbers.</td>
                <td>Guest scans the QR code at Table 4 and the exact IDR 35,000 pops up automatically on GoPay or mobile banking.</td>
            </tr>
            <tr>
                <td><strong>Kitchen Display System</strong></td>
                <td>A barista tablet monitor that displays and organizes digital orders chronologically without paper tickets.</td>
                <td>Barista screen showing that Table 2 ordered a Jasmine Tea with 50% sweetness and extra dried petals.</td>
            </tr>
            <tr>
                <td><strong>Server Anti-Tampering</strong></td>
                <td>Security shield preventing dishonest guests from altering beverage prices on their phone browsers.</td>
                <td>If someone tampers with code to change IDR 30,000 to IDR 1,000, the central server detects and cancels the transaction.</td>
            </tr>
            <tr>
                <td><strong>Idempotency Lock</strong></td>
                <td>Protection mechanism ensuring guest bank balances are never debited twice from repeated button taps.</td>
                <td>Guest taps 'Pay' three times during poor internet reception, but only one debit is processed.</td>
            </tr>
            <tr>
                <td><strong>Botanical Tisane</strong></td>
                <td>Pure herbal infusions crafted from flowers, herbs, and spices rather than industrial black tea leaves.</td>
                <td>Vibrant red rosella iced tea or golden chamomile soothing infusion.</td>
            </tr>
            <tr>
                <td><strong>24 Solar Terms</strong></td>
                <td>Traditional natural calendar aligning herbal benefits with seasonal bodily needs.</td>
                <td>Enjoying cooling spearmint tea during the peak heat of the Summer Solstice.</td>
            </tr>
        </tbody>
    </table>

    <div class="rule"></div>

    <div style="text-align: center; font-size: 8pt; color: #4a5568; margin-top: 16pt;">
        Officially published by the <strong>Board of Founders, CHANGKEER ATELIER</strong>.<br>
        Almaidah Chaerudin Putri • Annisha Humaira • Johana Abigael Rumbiak • Keyla Putri Adisty • Nursoleha Romadhoni.<br>
        &copy; 2026 CHANGKEER ATELIER. All Rights Reserved.
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
    out = generate_manual_book_en(assets)
    print(f"English Manual Book generated. Total chars: {len(out)}")
