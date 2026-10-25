#!/usr/bin/env python3
"""
manual_book_en.py - Generator for English Manual Book (A4 Portrait)
Clean Editorial Craft Style, Zero AI-Slop, No Badges, Round Bullets,
No Terminal ASCII, Real Product Photos, Layman-Friendly Terms,
Team / Kelompok Specification, and Zero Markdown Asterisks.
"""

def generate_manual_book_en(assets: dict) -> str:
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CHANGKEER ATELIER — OPERATIONS &amp; SYSTEM MANUAL BOOK</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

@page {{
    size: A4 portrait;
    margin: 22mm 18mm 22mm 18mm;
    @top-left {{
        content: "CHANGKEER ATELIER — SYSTEM MANUAL &amp; OPERATIONAL GUIDE";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #6b7280;
    }}
    @top-right {{
        content: "REV. 2.0 • 2026";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 600;
        color: #946c38;
    }}
    @bottom-left {{
        content: "CHANGKEER System Engineering Team • All Rights Reserved";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        color: #9ca3af;
    }}
    @bottom-right {{
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 600;
        color: #4b5563;
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
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 9.5pt;
    line-height: 1.65;
    color: #24292f;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
}}

/* Typography */
h1, h2, h3, h4 {{
    color: #143828;
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    margin-top: 0;
    page-break-after: avoid;
}}

h1 {{
    font-size: 20pt;
    line-height: 1.25;
    margin-bottom: 8pt;
    border-bottom: 1.5px solid #143828;
    padding-bottom: 6pt;
}}

h2 {{
    font-size: 14pt;
    line-height: 1.3;
    margin-top: 18pt;
    margin-bottom: 6pt;
    color: #143828;
}}

h3 {{
    font-size: 11pt;
    line-height: 1.35;
    margin-top: 14pt;
    margin-bottom: 4pt;
    color: #946c38;
}}

p {{
    margin-top: 0;
    margin-bottom: 8pt;
    text-align: justify;
}}

/* Lists with Circular Bullets */
ul {{
    list-style-type: disc !important;
    margin-top: 4pt;
    margin-bottom: 10pt;
    padding-left: 18px;
}}

ul li {{
    margin-bottom: 4pt;
    line-height: 1.55;
}}

ol {{
    margin-top: 4pt;
    margin-bottom: 10pt;
    padding-left: 20px;
}}

ol li {{
    margin-bottom: 4pt;
    line-height: 1.55;
}}

/* Section Eyebrow (No badges) */
.section-eyebrow {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #946c38;
    margin-bottom: 4pt;
}}

/* Divider Line */
.rule {{
    border: none;
    border-top: 1px solid #e5e2da;
    margin: 16pt 0;
}}

/* Editorial Note / Layman Box */
.layman-note {{
    border-left: 3px solid #143828;
    background-color: #fbfaf7;
    padding: 8pt 12pt;
    margin: 10pt 0 14pt 0;
    font-size: 9pt;
}}

.layman-note-title {{
    font-weight: 700;
    color: #143828;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 3pt;
}}

/* Tables */
table.editorial-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
}}

table.editorial-table th {{
    border-top: 1.5px solid #143828;
    border-bottom: 1.5px solid #143828;
    padding: 6pt 8pt;
    text-align: left;
    font-weight: 700;
    color: #143828;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #f7f6f1;
}}

table.editorial-table td {{
    border-bottom: 1px solid #e5e2da;
    padding: 6pt 8pt;
    vertical-align: top;
}}

table.editorial-table tr:nth-child(even) td {{
    background-color: #fcfbf9;
}}

/* Visual Workflow Diagram (No Terminal ASCII) */
.workflow-container {{
    margin: 14pt 0;
    page-break-inside: avoid;
}}

.workflow-step {{
    display: table;
    width: 100%;
    margin-bottom: 8pt;
    background-color: #fbfaf7;
    border: 1px solid #e5e2da;
    padding: 8pt 12pt;
}}

.workflow-num {{
    display: table-cell;
    width: 32px;
    vertical-align: middle;
    font-family: 'Playfair Display', serif;
    font-size: 16pt;
    font-weight: 700;
    color: #143828;
}}

.workflow-content {{
    display: table-cell;
    vertical-align: middle;
    padding-left: 10pt;
}}

.workflow-title {{
    font-weight: 700;
    color: #143828;
    font-size: 9.5pt;
    margin-bottom: 2pt;
}}

.workflow-desc {{
    font-size: 8.5pt;
    color: #4b5563;
    line-height: 1.45;
}}

.workflow-arrow {{
    text-align: center;
    color: #946c38;
    font-size: 14pt;
    line-height: 1;
    margin: -4pt 0 4pt 0;
}}

/* Product Showcase Grid */
.product-row {{
    display: table;
    width: 100%;
    margin: 10pt 0;
    page-break-inside: avoid;
    border-bottom: 1px solid #e5e2da;
    padding-bottom: 10pt;
}}

.product-img-col {{
    display: table-cell;
    width: 110px;
    vertical-align: top;
}}

.product-img-col img {{
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 1px solid #e5e2da;
}}

.product-info-col {{
    display: table-cell;
    vertical-align: top;
    padding-left: 14pt;
}}

.product-name {{
    font-family: 'Playfair Display', serif;
    font-size: 12pt;
    font-weight: 700;
    color: #143828;
    margin-bottom: 2pt;
}}

.product-meta {{
    font-size: 8pt;
    font-weight: 600;
    color: #946c38;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4pt;
}}

.product-desc {{
    font-size: 8.5pt;
    color: #374151;
    line-height: 1.45;
}}

/* Cover Page */
.cover-page {{
    page-break-after: always;
    height: 100vh;
    padding: 35mm 22mm 25mm 22mm;
    background-color: #143828;
    color: #f7f6f1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
}}

.cover-header {{
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 16pt;
}}

.cover-brand-title {{
    font-size: 11pt;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #dfba7c;
}}

.cover-body {{
    margin: auto 0;
}}

.cover-main-title {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 32pt;
    font-weight: 700;
    line-height: 1.15;
    color: #ffffff;
    margin-bottom: 12pt;
}}

.cover-subtitle {{
    font-size: 11.5pt;
    line-height: 1.6;
    color: #d1d5db;
    max-width: 520px;
    margin-bottom: 24pt;
}}

.cover-meta-grid {{
    display: table;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    padding-top: 14pt;
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
    font-size: 9pt;
    font-weight: 600;
    color: #ffffff;
}}

.cover-footer {{
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 12pt;
    font-size: 8pt;
    color: #9ca3af;
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
        <div class="cover-brand-title">CHANGKEER ATELIER • OFFICIAL OPERATIONS DOCUMENT</div>
    </div>

    <div class="cover-body">
        <div style="margin-bottom: 14pt;">
            <img src="{assets['logo']}" style="width: 75px; height: 75px; border-radius: 50%; border: 2px solid #dfba7c;" alt="Changkeer Logo">
        </div>
        <div class="cover-main-title">Operations &amp; System Manual Book</div>
        <div class="cover-subtitle">
            Comprehensive Operational Standard Operating Procedures (SOP), Self-Service Ordering Flow, Dynamic QRIS Payment Infrastructure, Kitchen Display System (KDS), and Digital Store Management.
        </div>

        <div class="cover-meta-grid">
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Document ID</div>
                <div class="cover-meta-val">CK-SOP-2026-EN</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Project Team</div>
                <div class="cover-meta-val">System Engineering Team</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Lead Architect</div>
                <div class="cover-meta-val">Muhammad Ilham</div>
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

<!-- DOCUMENT CONTROL & TEAM SECTION -->
<div class="page-break">
    <div class="section-eyebrow">Document Control &amp; Team Roster</div>
    <h1>Project Team Roster &amp; Authority Sheet</h1>

    <p>
        This Operations Manual serves as the official operational guide and technical manual for the <strong>CHANGKEER ATELIER</strong> digital ecosystem. It governs store procedures across software engineering, tea brewing specialists (baristas), counter cashiers, and store supervisors.
    </p>

    <h2>Project Development Team Structure</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 28%;">Role / Department</th>
                <th style="width: 30%;">Lead Person</th>
                <th>Core Responsibilities</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Project Lead &amp; System Architect</strong></td>
                <td><strong>Muhammad Ilham</strong></td>
                <td>Overseeing architecture design, full-stack Next.js &amp; Supabase implementation, dynamic QRIS payment security, and quality assurance.</td>
            </tr>
            <tr>
                <td><strong>Frontend &amp; UI/UX Division</strong></td>
                <td>User Interface Team</td>
                <td>Crafting self-service mobile interfaces, responsive layouts, ergonomic touch controls, and frictionless checkout flows.</td>
            </tr>
            <tr>
                <td><strong>Botanical R&amp;D &amp; Barista Standards</strong></td>
                <td>Tea Specialists &amp; R&amp;D Team</td>
                <td>Formulating the 24 seasonal blends, extraction temperatures, natural sweetness scales, and steeping duration standards.</td>
            </tr>
            <tr>
                <td><strong>Store Operations &amp; Cashier Services</strong></td>
                <td>Store Operations Team</td>
                <td>Executing counter POS tasks, verifying payment transactions, handling customer edge cases, and conducting daily cash reconciliations.</td>
            </tr>
        </tbody>
    </table>

    <h2>Table of Contents</h2>
    <ul style="line-height: 1.8; margin-top: 10pt;">
        <li><strong>Chapter 1:</strong> Introduction to CHANGKEER &amp; The 24 Seasons Philosophy</li>
        <li><strong>Chapter 2:</strong> System Architecture &amp; Technology Ecosystem</li>
        <li><strong>Chapter 3:</strong> Product Catalog, Botanical Gallery &amp; Customization Rules</li>
        <li><strong>Chapter 4:</strong> Transaction Flow, Dynamic QRIS &amp; Payment Security</li>
        <li><strong>Chapter 5:</strong> Barista Standard Operating Procedures (SOP) at the Bar</li>
        <li><strong>Chapter 6:</strong> Cashier Operations &amp; Daily Financial Reconciliation</li>
        <li><strong>Chapter 7:</strong> Store Administration &amp; Menu Management (Admin Panel)</li>
        <li><strong>Chapter 8:</strong> Practical Glossary for Laymen &amp; Quick Troubleshooting Matrix</li>
    </ul>

    <div class="layman-note">
        <div class="layman-note-title">Editorial Principle: Clear Layman-Friendly Language</div>
        This manual is authored in direct, structured prose free from unnecessary jargon. Every technical computing concept and specialized brewing term is accompanied by intuitive real-world analogies to ensure immediate clarity for all evaluators and team members.
    </div>
</div>

<!-- CHAPTER 1 -->
<div class="page-break">
    <div class="section-eyebrow">Chapter 01 • Philosophy &amp; Concept</div>
    <h1>Understanding CHANGKEER &amp; The 24 Seasons</h1>

    <h2>1.1 What is CHANGKEER?</h2>
    <p>
        <strong>CHANGKEER</strong> is a contemporary artisan herbal tea atelier that bridges Indonesia's rich botanical heritage with the ancient wisdom of the 24 Solar Terms. Unlike noisy commercial coffee chains or unstandardized traditional herbal stalls, CHANGKEER offers a serene sanctuary where mindful individuals can enjoy meticulously calibrated, health-restorative beverages.
    </p>

    <div class="layman-note">
        <div class="layman-note-title">Layman Explanation: Herbal Tisanes vs Commercial Teas</div>
        Many assume all teas are identical. In reality, mass-market tea bags often rely on industrial black tea dust enhanced with synthetic flavorings. In contrast, <strong>CHANGKEER Herbal Tisanes</strong> are brewed purely from whole botanicals, premium herbs, and fresh petals—such as wild jasmine, butterfly pea, red ginger, and spearmint—completely free of synthetic chemicals and harsh gastric irritants.
    </div>

    <h2>1.2 Why Use the 24 Solar Terms Cycle?</h2>
    <p>
        Human metabolism naturally responds to atmospheric shifts throughout the year. During scorching summer days, the body craves internal cooling and cellular hydration. Conversely, in damp or chilly conditions, it requires restorative spices that gently stimulate circulation.
    </p>
    <p>
        CHANGKEER categorizes its blends into four primary seasonal pillars adapted from the 24 astronomical solar divisions:
    </p>
    <ul>
        <li><strong>Spring (Renewal &amp; Detox):</strong> Gentle floral notes that refresh the senses, support internal cleansing, and awaken vital energy after prolonged fatigue.</li>
        <li><strong>Summer (Cooling &amp; Hydration):</strong> Cooling spearmint, lemongrass, and natural citrus that reduce body heat and quench thirst without sugar spikes.</li>
        <li><strong>Autumn (Balance &amp; Serenity):</strong> Soothing whole chamomile, sweet cinnamon, and licorice root that calm the nervous system and ease mental tension.</li>
        <li><strong>Winter (Warmth &amp; Immunity):</strong> Robust aged red ginger, cloves, and wild forest honey that provide deep thermal comfort and strengthen natural immunity.</li>
    </ul>

    <h2>1.3 Why a Digital Self-Service Platform?</h2>
    <p>
        Crafting botanical tisanes requires exact steeping durations and strict water temperatures. If baristas are distracted by scribbling paper tickets, calculating change, and memorizing custom sweetness preferences, craft quality inevitably suffers.
    </p>
    <p>
        The CHANGKEER digital ecosystem enables guests to customize their brews directly from their smartphones and pay instantly via dynamic QRIS, allowing baristas behind the bar to focus 100% on precision extraction and tea craftsmanship.
    </p>
</div>

<!-- CHAPTER 2 -->
<div class="page-break">
    <div class="section-eyebrow">Chapter 02 • System Architecture</div>
    <h1>System Structure &amp; Technology Ecosystem</h1>

    <h2>2.1 How the System Works Behind the Scenes</h2>
    <p>
        The CHANGKEER software architecture is constructed with modern web standards to deliver instantaneous page loads, high reliability, and robust data protection across customer smartphones, cashier POS stations, and barista touchscreens.
    </p>

    <div class="layman-note">
        <div class="layman-note-title">Simple Everyday Analogy: The Anatomy of CHANGKEER</div>
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

<!-- CHAPTER 3 -->
<div class="page-break">
    <div class="section-eyebrow">Chapter 03 • Menu &amp; Products</div>
    <h1>Product Catalog, Botanical Gallery &amp; Customization</h1>

    <h2>3.1 Three Signature Blends</h2>
    <p>
        Every CHANGKEER blend uses whole-leaf Camellia sinensis harmonized with native Indonesian botanicals:
    </p>

    <!-- Product 1: Jasmine -->
    <div class="product-row">
        <div class="product-img-col">
            <img src="{assets['jasmine']}" alt="Jasmine Tea">
        </div>
        <div class="product-info-col">
            <div class="product-name">CHANGKEER Jasmine Tea Signature</div>
            <div class="product-meta">Category: Floral Tisane • Water Temp: 85°C • Steeping: 4 Minutes</div>
            <div class="product-desc">
                High-altitude green tea infused with natural mountain jasmine blossoms. Delivers a calming floral bouquet that reduces daily mental fatigue and leaves a gentle, sweet finish on the palate.
            </div>
        </div>
    </div>

    <!-- Product 2: Vanilla Mint -->
    <div class="product-row">
        <div class="product-img-col">
            <img src="{assets['vanilla_mint']}" alt="Vanilla Mint Tea">
        </div>
        <div class="product-info-col">
            <div class="product-name">CHANGKEER Vanilla Mint Tea</div>
            <div class="product-meta">Category: Refreshing Tisane • Water Temp: 90°C • Steeping: 5 Minutes</div>
            <div class="product-desc">
                Crisp upland peppermint leaves balanced with warm, sweet organic vanilla extract. Renowned for clearing the airways, soothing digestion, and refreshing body temperature in warm climates.
            </div>
        </div>
    </div>

    <!-- Product 3: English Breakfast -->
    <div class="product-row">
        <div class="product-img-col">
            <img src="{assets['english_breakfast']}" alt="English Breakfast Tea">
        </div>
        <div class="product-info-col">
            <div class="product-name">CHANGKEER English Breakfast Tea</div>
            <div class="product-meta">Category: Robust Black Tea • Water Temp: 95°C • Steeping: 3.5 Minutes</div>
            <div class="product-desc">
                A full-bodied, invigorating blend of select Indonesian black tea leaves. Formulated to provide sustained morning mental clarity without stomach acidity. Packaged in bleach-free, microplastic-free pouches.
            </div>
        </div>
    </div>

    <h2>3.2 Four Seasonal Hero Blends</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Season</th>
                <th style="width: 35%;">Blend Name</th>
                <th>Wellness Function &amp; Botanical Ingredients</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Spring</strong></td>
                <td>Start of Spring (立春)</td>
                <td>Rose petals, sweet jasmine buds, and upland green tea for gentle spring detoxification.</td>
            </tr>
            <tr>
                <td><strong>Summer</strong></td>
                <td>Summer Solstice (夏至)</td>
                <td>Cooling spearmint, aromatic lemongrass, and sun-dried lemon slices for intense hydration.</td>
            </tr>
            <tr>
                <td><strong>Autumn</strong></td>
                <td>Autumn Equinox (秋分)</td>
                <td>Whole German chamomile, fragrant cinnamon bark, and licorice root for nervous relaxation.</td>
            </tr>
            <tr>
                <td><strong>Winter</strong></td>
                <td>Winter Solstice (冬至)</td>
                <td>Aged red ginger root, Maluku cloves, and raw wild honey for deep warmth and vitality.</td>
            </tr>
        </tbody>
    </table>

    <h2>3.3 Standardized Guest Customization Options</h2>
    <p>
        The self-service ordering system offers three distinct parameters to honor individual health preferences:
    </p>
    <ul>
        <li><strong>Brew Temperature:</strong> Traditional Hot Clay Pot or Iced Shaken Tea (+IDR 2,000 using purified craft ice).</li>
        <li><strong>Natural Sweetness Levels:</strong> 0% (No Added Sugar), 30% (Light Sweetness), 50% (Tea Forward), 75% (Balanced), and 100% (Full Sweetness).</li>
        <li><strong>Botanical Petal Toppings (+IDR 3,000):</strong> Fresh Butterfly Pea (Telang), Dried Mountain Jasmine, Royal Marigold Blossoms, or Raw Forest Honey Nectar.</li>
    </ul>
</div>

<!-- CHAPTER 4 -->
<div class="page-break">
    <div class="section-eyebrow">Chapter 04 • Workflow &amp; Security</div>
    <h1>Ordering Workflow, Dynamic QRIS &amp; Security</h1>

    <h2>4.1 End-to-End Guest Ordering Workflow</h2>
    <p>
        The complete digital transaction flow from guest table to barista pickup counter:
    </p>

    <!-- Visual HTML/SVG Flow Diagram -->
    <div class="workflow-container">
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
                <div class="workflow-desc">The barista brews the cup at exact water temperature, taps 'Ready to Serve', and presents the beverage with a digital thermal receipt.</div>
            </div>
        </div>
    </div>

    <h2>4.2 The Superiority of Dynamic QRIS</h2>
    <div class="layman-note">
        <div class="layman-note-title">Layman Explanation: Static Paper QR vs Dynamic QRIS</div>
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
    <div class="section-eyebrow">Chapter 05 • Barista Standards</div>
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

    <h2>5.4 Table Handover &amp; Service Etiquette</h2>
    <p>
        Once the brew is finished, tap the <strong>'Ready to Serve'</strong> button on the KDS monitor. Carry the cup or clay teapot using the wooden presentation tray, greet the guest warmly with their order name and table number, and briefly mention the primary aromatic notes of their tea.
    </p>
</div>

<!-- CHAPTER 6 -->
<div class="page-break">
    <div class="section-eyebrow">Chapter 06 • Cashier Procedures</div>
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

<!-- CHAPTER 7 -->
<div class="page-break">
    <div class="section-eyebrow">Chapter 07 • Store Management</div>
    <h1>Admin Panel Governance &amp; Menu Control</h1>

    <h2>7.1 Accessing the Central Management Portal</h2>
    <p>
        The administration dashboard is located at <code>/admin</code> and is strictly restricted to authenticated personnel. It employs encrypted session tokens to safeguard customer orders and menu configurations from unauthorized remote access.
    </p>

    <h2>7.2 Managing Menu Availability &amp; Botanical Stock</h2>
    <p>
        If a specific botanical petal (such as whole chamomile) runs out due to harvest delays, store managers can toggle item visibility in under five seconds:
    </p>
    <ol>
        <li>Navigate to the <strong>Product Catalog</strong> tab in the admin sidebar.</li>
        <li>Locate the affected tea blend or topping item.</li>
        <li>Toggle the active status switch to <strong>'Out of Stock'</strong>.</li>
        <li>The item is immediately hidden from customer ordering screens, preventing unfulfillable orders.</li>
    </ol>

    <h2>7.3 Administering Promotional Vouchers</h2>
    <p>
        Managers can launch seasonal loyalty promotions, such as a 15% discount welcoming the arrival of Spring:
    </p>
    <ul>
        <li><strong>Voucher Code:</strong> Enter an uppercase alphanumeric code (e.g., <code>SPRINGWELLNESS</code>).</li>
        <li><strong>Discount Mechanism:</strong> Configure either percentage off (e.g., 15%) or a fixed currency deduction (e.g., IDR 10,000).</li>
        <li><strong>Minimum Order Requirement:</strong> Establish the threshold basket size required for voucher activation (e.g., IDR 50,000).</li>
        <li><strong>Usage Caps:</strong> Define maximum redemption limits to protect promotional marketing budgets.</li>
    </ul>

    <h2>7.4 Exporting Financial Audits &amp; Sales Reports</h2>
    <p>
        The dashboard visualizes daily, weekly, and monthly revenue curves, alongside top-performing seasonal teas. Complete transactional history can be exported directly to standard CSV/Excel format for accounting audits and corporate tax filings.
    </p>
</div>

<!-- CHAPTER 8 -->
<div class="page-break">
    <div class="section-eyebrow">Chapter 08 • Glossary &amp; Quick Fixes</div>
    <h1>Practical Glossary for Laymen &amp; Quick Fixes</h1>

    <h2>8.1 Practical Glossary for Non-Technical Evaluators</h2>
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

    <h2>8.2 Quick Troubleshooting Matrix for Store Teams</h2>
    <ul>
        <li><strong>Barista KDS Display Loses Power:</strong> Inspect the power connection of the bar tablet. Ensure connection to the store's private Wi-Fi network <code>CHANGKEER_BAR_5G</code>. Refresh the browser at <code>/kds</code>.</li>
        <li><strong>Store Internet Connection Drops:</strong> The system automatically shifts to local resilience storage. Cashiers can continue recording cash orders, and sync resumes automatically once connectivity restores.</li>
        <li><strong>Thermal Printer Jams:</strong> Check the 58mm/80mm thermal paper roll inside the counter printer. Ensure the cover latch clicks shut and the status LED glows solid green.</li>
    </ul>

    <div class="rule"></div>

    <div style="text-align: center; font-size: 8pt; color: #6b7280; margin-top: 18pt;">
        Officially published by the <strong>CHANGKEER System Engineering Group</strong>.<br>
        Lead Architect &amp; Full-Stack Engineer: <strong>Muhammad Ilham</strong>.<br>
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
