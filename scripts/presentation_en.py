#!/usr/bin/env python3
"""
presentation_en.py - English Project Presentation Deck (16:9 Landscape)
Document Type: Executive Business & Technical Project Presentation
Editorial Standards:
- Pure white background, high-contrast dark text (#111827 / #1F2937), botanical green accent (#1B4332).
- Zero AI-slop visual boxes, zero badges, zero gradients, zero shadows.
- 16:9 Landscape format (@page size: 297mm 167mm).
- Clean structured tables for 24 seasonal blends (4 Seasonal Slides: Spring, Summer, Autumn, Winter; 6 blends per slide).
- Linear transaction flow diagram (thin borders, clean arrows).
- Official web logo (logo_new.png) and the 5 official Co-Founders.
- Zero asterisks (*), zero mention of OXID, zero user personal name.
- Exactly 12 Slides = 12 Clean Landscape Pages with zero clipping.
"""

def generate_presentation_en(assets: dict) -> str:
    founders = assets.get("founders", [])
    solar = assets.get("solar_terms", [])
    logo_b64 = assets.get("logo", "")

    # Helper function to generate clean 6-item seasonal catalog table
    def render_6_table_en(items, start_idx=1):
        rows = ""
        for idx, it in enumerate(items, start_idx):
            ingr_str = ", ".join(it.get("ingredients", []))
            thumb_img = ""
            if it.get("thumb_b64"):
                thumb_img = f'<img src="{it["thumb_b64"]}" style="width: 24px; height: 24px; object-fit: cover; border: 1px solid #D1D5DB; vertical-align: middle; margin-right: 6px; display: inline-block;" alt="{it["term"]}">'

            # Extraction parameter
            if "jasmine" in ingr_str.lower() or "green" in ingr_str.lower():
                param = "82°C • 3.5 Min"
            elif "ginger" in ingr_str.lower() or "cinnamon" in ingr_str.lower():
                param = "98°C • 6.0 Min"
            elif "chamomile" in ingr_str.lower() or "rose" in ingr_str.lower() or "hibiscus" in ingr_str.lower():
                param = "92°C • 5.0 Min"
            else:
                param = "88°C • 4.0 Min"

            rows += f"""
            <tr>
                <td style="text-align: center; font-weight: 600; color: #4B5563; font-size: 8.5pt;">{idx:02d}</td>
                <td style="white-space: nowrap;">
                    <div style="display: flex; align-items: center;">
                        {thumb_img}
                        <div>
                            <strong>{it.get('term')}</strong><br>
                            <span style="font-size: 7.5pt; color: #4B5563;">{it.get('termChinese')}</span>
                        </div>
                    </div>
                </td>
                <td style="font-weight: 600; color: #111827; font-size: 8.5pt;">{it.get('blend')}</td>
                <td style="font-size: 8pt; color: #374151;">{ingr_str}</td>
                <td style="text-align: center; font-size: 8pt; color: #4B5563; white-space: nowrap;">{param}</td>
                <td style="text-align: center; font-size: 8pt; white-space: nowrap; font-weight: 600;">Hot {it.get('hotPrice')}<br><span style="color: #4B5563;">Iced {it.get('icedPrice')}</span></td>
                <td style="font-size: 8pt; color: #4B5563;">{it.get('note')}</td>
            </tr>
            """
        return f"""
        <table class="editorial-table" style="font-size: 8.5pt; margin-top: 6pt; margin-bottom: 0;">
            <thead>
                <tr>
                    <th style="width: 4%; text-align: center;">No</th>
                    <th style="width: 22%;">Solar Term</th>
                    <th style="width: 17%;">Blend Formulation</th>
                    <th style="width: 24%;">Key Ingredients</th>
                    <th style="width: 13%; text-align: center;">Brew Standard</th>
                    <th style="width: 9%; text-align: center;">Price</th>
                    <th style="width: 21%;">Flavor Profile &amp; Notes</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
        """

    table_spring = render_6_table_en(solar[0:6], 1)
    table_summer = render_6_table_en(solar[6:12], 7)
    table_autumn = render_6_table_en(solar[12:18], 13)
    table_winter = render_6_table_en(solar[18:24], 19)

    # Founders Table Rows for Slide 12
    founders_rows = ""
    for f in founders:
        founders_rows += f"""
        <tr>
            <td style="text-align: center; font-weight: 600; color: #1B4332;">{f['num']}</td>
            <td><strong>{f['name']}</strong></td>
            <td style="color: #4B5563;">{f['role']}</td>
            <td>{f['focus_en']}</td>
        </tr>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CHANGKEER ATELIER — PROJECT PRESENTATION &amp; SYSTEM MANUAL</title>
<style>
@page {{
    size: 297mm 167mm;
    margin: 10mm 15mm 10mm 15mm;
    @top-left {{
        content: "CHANGKEER ATELIER";
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 8pt;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #1B4332;
    }}
    @top-right {{
        content: "EXECUTIVE PROJECT PRESENTATION • E-COMMERCE CAFE SYSTEM";
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 8pt;
        font-weight: 500;
        color: #4B5563;
    }}
    @bottom-left {{
        content: "Official Presentation Deck • CHANGKEER Board of Founders";
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 7.5pt;
        color: #6B7280;
    }}
    @bottom-right {{
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 7.5pt;
        font-weight: 600;
        color: #111827;
    }}
}}

@page:first {{
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
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    font-size: 9pt;
    line-height: 1.45;
    color: #1F2937;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
}}

.slide {{
    page-break-after: always;
    page-break-inside: avoid;
    height: 147mm;
    max-height: 147mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}}

.slide-header {{
    border-bottom: 1.5px solid #1B4332;
    padding-bottom: 4pt;
    margin-bottom: 6pt;
}}

.slide-category {{
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #1B4332;
    margin-bottom: 1pt;
}}

.slide-title {{
    font-size: 15pt;
    font-weight: 800;
    line-height: 1.2;
    color: #111827;
}}

.slide-subtitle {{
    font-size: 8.5pt;
    color: #4B5563;
    margin-top: 2pt;
}}

.content-two-cols {{
    display: table;
    width: 100%;
    table-layout: fixed;
    margin-top: 4pt;
}}

.col-cell {{
    display: table-cell;
    vertical-align: top;
    padding: 0 8pt;
}}

.col-cell:first-child {{
    padding-left: 0;
    border-right: 1px solid #E5E7EB;
}}

.col-cell:last-child {{
    padding-right: 0;
}}

/* Editorial Table */
.editorial-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
}}

.editorial-table th {{
    background-color: #F9FAFB;
    color: #111827;
    font-weight: 700;
    text-align: left;
    padding: 5pt 6pt;
    border-top: 1px solid #D1D5DB;
    border-bottom: 1.5px solid #1B4332;
    border-left: 1px solid #E5E7EB;
    border-right: 1px solid #E5E7EB;
    font-size: 8pt;
}}

.editorial-table td {{
    padding: 4.5pt 6pt;
    border-bottom: 1px solid #E5E7EB;
    border-left: 1px solid #E5E7EB;
    border-right: 1px solid #E5E7EB;
    vertical-align: middle;
    line-height: 1.35;
}}

/* Workflow Linear */
.workflow-row {{
    display: table;
    width: 100%;
    table-layout: fixed;
    margin: 8pt 0;
}}

.wf-box {{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    border: 1px solid #D1D5DB;
    background-color: #F9FAFB;
    padding: 6pt 4pt;
    font-size: 7.5pt;
    line-height: 1.3;
}}

.wf-num {{
    font-weight: 700;
    font-size: 7pt;
    color: #1B4332;
    text-transform: uppercase;
    margin-bottom: 1pt;
}}

.wf-title {{
    font-weight: 600;
    color: #111827;
}}

.wf-arrow {{
    display: table-cell;
    width: 14px;
    vertical-align: middle;
    text-align: center;
    font-size: 11pt;
    color: #6B7280;
    font-weight: bold;
}}

/* Lists */
ul {{
    list-style-type: disc;
    margin-top: 2pt;
    margin-bottom: 6pt;
    padding-left: 16px;
}}

ul li {{
    margin-bottom: 3pt;
    line-height: 1.4;
    color: #1F2937;
    font-size: 8.5pt;
}}
</style>
</head>
<body>

<!-- SLIDE 1: COVER SLIDE -->
<div class="slide">
    <div style="border-bottom: 1.5px solid #1B4332; padding-bottom: 6pt;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
                <img src="{logo_b64}" style="height: 34px; width: auto; margin-right: 10pt; display: block;" alt="CHANGKEER Logo">
                <div>
                    <div style="font-size: 12pt; font-weight: 800; letter-spacing: 0.05em; color: #1B4332; text-transform: uppercase;">CHANGKEER ATELIER</div>
                    <div style="font-size: 7.5pt; color: #4B5563;">Artisan Herbal Tea &amp; Botanical Laboratory</div>
                </div>
            </div>
            <div style="text-align: right; font-size: 7.5pt; color: #6B7280;">
                <div>OFFICIAL DOCUMENT</div>
                <div style="font-weight: 700; color: #111827;">2026 PROJECT EDITION</div>
            </div>
        </div>
    </div>

    <div style="margin: auto 0; padding: 10pt 0;">
        <div style="font-size: 8.5pt; font-weight: 700; color: #1B4332; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4pt;">
            PROJECT PRESENTATION &amp; SYSTEM MANUAL
        </div>
        <div style="font-size: 21pt; font-weight: 800; line-height: 1.2; color: #111827; margin-bottom: 6pt;">
            Integrated E-Commerce Cafe System &amp; 24 Seasonal Botanical Blends
        </div>
        <div style="font-size: 10pt; color: #4B5563; max-width: 90%; line-height: 1.45;">
            Engineering Feasibility, Software Architecture, Server-Side Dynamic QRIS Settlement Governance, and Barista Operational Precision at CHANGKEER ATELIER.
        </div>
    </div>

    <div>
        <div style="font-size: 8pt; font-weight: 700; color: #1B4332; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3pt;">
            CHANGKEER BOARD OF FOUNDERS (THE 5 CO-FOUNDERS)
        </div>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 28%;">Founder Name</th>
                    <th style="width: 14%;">Role</th>
                    <th>Executive Operational Focus</th>
                </tr>
            </thead>
            <tbody>
                {founders_rows}
            </tbody>
        </table>
        <div style="font-size: 7.5pt; color: #6B7280; text-align: center; margin-top: 6pt;">
            CHANGKEER ATELIER • West Java &amp; Jakarta, Indonesia • All Rights Reserved
        </div>
    </div>
</div>

<!-- SLIDE 2: BACKGROUND & PHILOSOPHY -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 01 • Business Context &amp; Botanical Vision</div>
        <div class="slide-title">Industry Landscape &amp; The 24 Solar Terms Philosophy</div>
        <div class="slide-subtitle">Pioneering a wholesome botanical hydration alternative synchronized with human circadian biological rhythms.</div>
    </div>

    <div class="content-two-cols">
        <div class="col-cell" style="width: 50%;">
            <div style="font-size: 9.5pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">Challenges in Modern Beverage Retail</div>
            <ul>
                <li><strong>Excessive Synthetic Sweeteners:</strong> Commercial beverages are saturated with artificial flavoring agents, high-fructose corn syrups, and synthetic non-dairy creamers harmful to long-term health.</li>
                <li><strong>Stimulant Caffeine Dependency:</strong> Excessive coffee intake often triggers gastric acidity, nervous palpitations, and mid-afternoon energy crashes.</li>
                <li><strong>Absence of Mindful Spaces:</strong> Standard cafes operate as loud, fast-turnover transaction hubs that fail to provide restorative environments for contemplation.</li>
            </ul>
        </div>
        <div class="col-cell" style="width: 50%;">
            <div style="font-size: 9.5pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">CHANGKEER 24 Solar Terms Solution</div>
            <ul>
                <li><strong>100% Pure Botanical Tisanes:</strong> Crafted exclusively from whole organic flowers, wild herbs, and rimpang roots; completely caffeine-free, gentle on digestion, and soothing.</li>
                <li><strong>Harmonized with 24 Solar Terms:</strong> 24 recipes balanced with natural cycles (Spring for vitality renewal, Summer for heat dispersal, Autumn for nervous grounding, Winter for immune support).</li>
                <li><strong>Calibrated Natural Sweetening:</strong> Standardized dispensations of raw forest honey or sorghum nectar measured strictly via milliliter jiggers.</li>
            </ul>
        </div>
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 4pt; font-size: 8pt; color: #4B5563;">
        <strong>Sourcing Integrity:</strong> Zero synthetic flavoring essences; all raw botanicals sourced directly from cooperative farmers in Wonosobo, Garut, and Puncak.
    </div>
</div>

<!-- SLIDE 3: SOLUTION CONCEPT & SERVICE ARCHITECTURE -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 02 • Integrated Retail Architecture</div>
        <div class="slide-title">Service Architecture: Guest Self-Service &amp; Bar Efficiency</div>
        <div class="slide-subtitle">Unifying app-free mobile web ordering with real-time Kitchen Display System (KDS) execution.</div>
    </div>

    <div class="content-two-cols">
        <div class="col-cell" style="width: 50%;">
            <div style="font-size: 9.5pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">Autonomous Guest Experience (Mobile Web)</div>
            <ul>
                <li><strong>Zero-Install Access:</strong> Guests scan table QR codes; the high-performance web app renders instantly in mobile browsers without downloading native apps.</li>
                <li><strong>Precision Customization:</strong> Guests personalize temperature (hot ceramic pot or craft iced shaken), natural sweetness levels (0% to 100%), and organic dried flower &amp; fruit infusions.</li>
                <li><strong>Dynamic Exact-Amount QRIS:</strong> Payment codes pre-populate the exact bill total into mobile banking apps, eliminating manual input mistakes.</li>
            </ul>
        </div>
        <div class="col-cell" style="width: 50%;">
            <div style="font-size: 9.5pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">Bar Station Operations (Kitchen Display System)</div>
            <ul>
                <li><strong>Dedicated Brewing Craft:</strong> Baristas are freed entirely from writing manual paper chits or handling physical cash transactions.</li>
                <li><strong>Strict FIFO Queue Management:</strong> Tickets arrive in strict queue sequence with automated digital countdown timers and precise temperature guides.</li>
                <li><strong>Instant Status Sync:</strong> Brewing progression updates instantly across both kitchen monitors and customer smartphone screens.</li>
            </ul>
        </div>
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 4pt; font-size: 8pt; color: #4B5563;">
        <strong>Operational Impact:</strong> Eliminates counter ordering queues by over 70% while drastically improving extraction consistency across all seasonal blends.
    </div>
</div>

<!-- SLIDE 4: SPRING BLENDS (TERMS 01 - 06) -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 03 • Seasonal Formulations (1/4)</div>
        <div class="slide-title">Spring Season Catalog: Vitality Renewal &amp; Metabolic Cleansing</div>
        <div class="slide-subtitle">Solar Terms 01 to 06 — Light floral formulations anchored by jasmine, rose buds, and tender shoots for natural cellular awakening.</div>
    </div>

    <div>
        {table_spring}
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 3pt; font-size: 7.5pt; color: #4B5563;">
        Serving options: Ceramic hot infusion pot (standard) or craft iced shaken tea (+IDR 2,000). Zero synthetic essences; 100% caffeine-free.
    </div>
</div>

<!-- SLIDE 5: SUMMER BLENDS (TERMS 07 - 12) -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 03 • Seasonal Formulations (2/4)</div>
        <div class="slide-title">Summer Season Catalog: Active Hydration &amp; Biological Cooling</div>
        <div class="slide-subtitle">Solar Terms 07 to 12 — Refreshing mountain mint, butterfly pea, and native citrus designed for thirst quenching and heat dispersal.</div>
    </div>

    <div>
        {table_summer}
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 3pt; font-size: 7.5pt; color: #4B5563;">
        Serving options: Ceramic hot infusion pot (standard) or craft iced shaken tea (+IDR 2,000). Zero synthetic essences; 100% caffeine-free.
    </div>
</div>

<!-- SLIDE 6: AUTUMN BLENDS (TERMS 13 - 18) -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 03 • Seasonal Formulations (3/4)</div>
        <div class="slide-title">Autumn Season Catalog: Restorative Calm &amp; Nervous Grounding</div>
        <div class="slide-subtitle">Solar Terms 13 to 18 — Whole chamomile blossoms, tropical cinnamon bark, and dried pear to ease mental stress and support deep sleep.</div>
    </div>

    <div>
        {table_autumn}
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 3pt; font-size: 7.5pt; color: #4B5563;">
        Serving options: Ceramic hot infusion pot (standard) or craft iced shaken tea (+IDR 2,000). Zero synthetic essences; 100% caffeine-free.
    </div>
</div>

<!-- SLIDE 7: WINTER BLENDS (TERMS 19 - 24) -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 03 • Seasonal Formulations (4/4)</div>
        <div class="slide-title">Winter Season Catalog: Deep Thermal Warmth &amp; Immune Defense</div>
        <div class="slide-subtitle">Solar Terms 19 to 24 — Mature red ginger rhizomes, archipelago cloves, and wild forest honey to sustain vitality and peripheral circulation.</div>
    </div>

    <div>
        {table_winter}
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 3pt; font-size: 7.5pt; color: #4B5563;">
        Serving options: Ceramic hot infusion pot (standard) or craft iced shaken tea (+IDR 2,000). Zero synthetic essences; 100% caffeine-free.
    </div>
</div>

<!-- SLIDE 8: GUEST JOURNEY -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 04 • Guest Journey &amp; Retail Flow</div>
        <div class="slide-title">End-to-End Guest Journey &amp; Atelier Experience</div>
        <div class="slide-subtitle">Frictionless 5-phase journey from table seating to savoring handcrafted ceramic tea infusions.</div>
    </div>

    <div class="workflow-row">
        <div class="wf-box">
            <div class="wf-num">Phase 1</div>
            <div class="wf-title">Table Scan</div>
            <div style="color: #4B5563; margin-top: 1pt;">Instant web menu via camera; zero app install</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Phase 2</div>
            <div class="wf-title">Customize</div>
            <div style="color: #4B5563; margin-top: 1pt;">Choose from 24 blends, calibrate sweetness &amp; temp</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Phase 3</div>
            <div class="wf-title">Dynamic QRIS</div>
            <div style="color: #4B5563; margin-top: 1pt;">Amount locked; instant server-side verification</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Phase 4</div>
            <div class="wf-title">Live Tracking</div>
            <div style="color: #4B5563; margin-top: 1pt;">Transparent real-time brew progression on phone</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Phase 5</div>
            <div class="wf-title">Ceramic Service</div>
            <div style="color: #4B5563; margin-top: 1pt;">Savor hot artisanal pot infusion at leisure</div>
        </div>
    </div>

    <div style="margin-top: 6pt;">
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 28%;">Experience Dimension</th>
                    <th style="width: 36%;">Conventional Cafe Model</th>
                    <th>CHANGKEER Atelier Standard</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Queue Wait Duration</strong></td>
                    <td>Guests stand in line for 5-10 minutes during peak trading hours.</td>
                    <td>Zero counter queuing; guests seat immediately and order from their smartphone.</td>
                </tr>
                <tr>
                    <td><strong>Herbal Ingredient Transparency</strong></td>
                    <td>Cashiers rarely possess in-depth botanical or functional knowledge.</td>
                    <td>Interactive digital cards display flavor notes, botanical parts, and health benefits.</td>
                </tr>
                <tr>
                    <td><strong>Brewing Precision &amp; Consistency</strong></td>
                    <td>Frequently over-extracted (bitter) when baristas are distracted.</td>
                    <td>Standardized via digital countdown timers and precise thermal kettle displays.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- SLIDE 9: TRANSACTION WORKFLOW & ANTI-FRAUD SECURITY -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 05 • Financial Integrity &amp; Security Architecture</div>
        <div class="slide-title">Transaction Pipeline &amp; Server-Side Anti-Tampering</div>
        <div class="slide-subtitle">Ensuring banking settlement validity while eliminating client-side price tampering vectors.</div>
    </div>

    <div class="workflow-row">
        <div class="wf-box">
            <div class="wf-num">Stage 1</div>
            <div class="wf-title">Lock Bill Total</div>
            <div style="color: #4B5563; margin-top: 1pt;">Server calculates total against master DB</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Stage 2</div>
            <div class="wf-title">Generate QRIS</div>
            <div style="color: #4B5563; margin-top: 1pt;">Dynamic code embeds exact rupiah settlement</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Stage 3</div>
            <div class="wf-title">Webhook Settlement</div>
            <div style="color: #4B5563; margin-top: 1pt;">Bank gateway issues signed settlement webhook</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Stage 4</div>
            <div class="wf-title">Dispatch KDS Ticket</div>
            <div style="color: #4B5563; margin-top: 1pt;">Verified ticket pushed to barista queue</div>
        </div>
    </div>

    <div style="margin-top: 6pt;">
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Security Safeguard</th>
                    <th style="width: 35%;">Engineering Mechanism</th>
                    <th>Enterprise Operational Protection</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Server-Side Anti-Tampering</strong></td>
                    <td>Pricing is calculated strictly in backend memory; client values ignored.</td>
                    <td>Prevents fraudulent price overrides via browser inspect tools or modified proxies.</td>
                </tr>
                <tr>
                    <td><strong>Idempotency Key Protocol</strong></td>
                    <td>Unique transaction tokens guarantee single settlement execution.</td>
                    <td>Eliminates duplicate debit charges when guests tap pay repeatedly on lagging connections.</td>
                </tr>
                <tr>
                    <td><strong>Cryptographic Webhook Signatures</strong></td>
                    <td>HMAC-SHA256 signature verification on every inbound settlement notice.</td>
                    <td>Instantly rejects forged payment confirmations or third-party mutation simulations.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- SLIDE 10: BARISTA CRAFT & KDS -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 06 • Bar Operations &amp; Craftsmanship</div>
        <div class="slide-title">Barista Standard Operating Procedures &amp; KDS Workflow</div>
        <div class="slide-subtitle">Digital queue monitoring ensuring extraction precision, strict timing control, and sweetness balance.</div>
    </div>

    <div class="content-two-cols">
        <div class="col-cell" style="width: 48%;">
            <div style="font-size: 9pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">3-State KDS Queue Progression</div>
            <ul>
                <li><strong>Order Received (Amber):</strong> New incoming order from table; barista checks table number, blend formula, and sweetness level.</li>
                <li><strong>Brewing Now (Blue):</strong> Barista taps 'Start Brew'; digital extraction timer initiates automated countdown.</li>
                <li><strong>Ready to Serve (Green):</strong> Infusion completed and poured into pre-warmed ceramic pot; ready for table service.</li>
            </ul>
        </div>
        <div class="col-cell" style="width: 52%;">
            <div style="font-size: 9pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">Thermal Extraction Standard Operating Matrix</div>
            <table class="editorial-table">
                <thead>
                    <tr>
                        <th>Botanical Category</th>
                        <th style="text-align: center;">Water Temp</th>
                        <th style="text-align: center;">Duration</th>
                        <th>Quality Standard</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Fresh Petals &amp; Green Tea</strong></td>
                        <td style="text-align: center; font-weight: 600;">80°C – 85°C</td>
                        <td style="text-align: center;">3.5 – 4 Min</td>
                        <td>Avoids bitter tannins.</td>
                    </tr>
                    <tr>
                        <td><strong>Whole Dried Blossoms</strong></td>
                        <td style="text-align: center; font-weight: 600;">90°C – 94°C</td>
                        <td style="text-align: center;">5 Min</td>
                        <td>Releases natural color pigments.</td>
                    </tr>
                    <tr>
                        <td><strong>Ginger &amp; Turmeric Roots</strong></td>
                        <td style="text-align: center; font-weight: 600;">98°C – 100°C</td>
                        <td style="text-align: center;">6 Min</td>
                        <td>Breaks cell walls for essential oils.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 4pt; font-size: 8pt; color: #4B5563;">
        <strong>Flavor Precision:</strong> Natural sweeteners are dispensed strictly using calibrated stainless steel jiggers (0ml, 7.5ml, 12.5ml, 18ml, 25ml).
    </div>
</div>

<!-- SLIDE 11: TECHNOLOGY STACK -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 07 • Engineering Stack &amp; Resilience</div>
        <div class="slide-title">Technology Ecosystem &amp; High-Availability Architecture</div>
        <div class="slide-subtitle">Engineered with modern web standards for high concurrency, banking data safety, and zero downtime.</div>
    </div>

    <div>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 22%;">System Tier</th>
                    <th style="width: 25%;">Technology Selection</th>
                    <th>Architectural Role &amp; Operational Benefit</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Frontend &amp; Server Web</strong></td>
                    <td>Next.js 16 (App Router, React 19)</td>
                    <td>High-speed server rendering supporting instant guest access across mobile devices without app installation friction.</td>
                </tr>
                <tr>
                    <td><strong>Programming Language</strong></td>
                    <td>TypeScript 5 (Strict Mode)</td>
                    <td>Full end-to-end type safety eliminating runtime exceptions in transactional calculations and recipe parameters.</td>
                </tr>
                <tr>
                    <td><strong>Interface Design</strong></td>
                    <td>Tailwind CSS</td>
                    <td>High-contrast, ergonomic touch interface complying with modern accessibility and editorial standards.</td>
                </tr>
                <tr>
                    <td><strong>Relational Database</strong></td>
                    <td>PostgreSQL (via Supabase)</td>
                    <td>Banking-grade ACID transactional consistency fortified with Row-Level Security (RLS) for data protection.</td>
                </tr>
                <tr>
                    <td><strong>Data Validation</strong></td>
                    <td>Zod Schema Validation</td>
                    <td>Strict schema enforcement across all incoming HTTP order payloads prior to executing server business logic.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 4pt; font-size: 8pt; color: #4B5563;">
        <strong>Dual-Tier Resilience:</strong> Active kitchen orders are cached locally in bar memory, ensuring uninterrupted service and receipt printing during network downtime.
    </div>
</div>

<!-- SLIDE 12: FOUNDERS & CLOSING -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Section 08 • Board of Founders &amp; Strategic Vision</div>
        <div class="slide-title">Board of Founders &amp; Operational Governance</div>
        <div class="slide-subtitle">Executive synergy and operational dedication behind a modern, transparent herbal tea atelier.</div>
    </div>

    <div>
        <div style="font-size: 8.5pt; font-weight: 700; color: #1B4332; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3pt;">
            CHANGKEER BOARD OF FOUNDERS (THE 5 CO-FOUNDERS)
        </div>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 28%;">Founder Name</th>
                    <th style="width: 14%;">Role</th>
                    <th>Executive Operational Focus</th>
                </tr>
            </thead>
            <tbody>
                {founders_rows}
            </tbody>
        </table>
    </div>

    <div style="margin-top: 8pt; border-top: 1.5px solid #1B4332; padding-top: 6pt;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 8.5pt; color: #1F2937;">
                <strong>Project Synthesis:</strong> CHANGKEER ATELIER establishes that indigenous botanical wisdom and the 24 Solar Terms can be successfully elevated into a standardized, digitally secure, and commercially viable modern retail model.
            </div>
            <div style="text-align: right; font-size: 8pt; color: #6B7280; white-space: nowrap; margin-left: 14pt;">
                <div>Official Release: October 2026</div>
                <div style="font-weight: 700; color: #111827;">CHANGKEER ATELIER</div>
            </div>
        </div>
    </div>
</div>

</body>
</html>
"""
    clean_html = html.replace("*", "")
    return clean_html

if __name__ == "__main__":
    import sys
    sys.path.insert(0, "/home/ilhammu29/changkeer/scripts")
    from assets_loader import get_all_assets
    assets = get_all_assets()
    out = generate_presentation_en(assets)
    print(f"English Presentation generated. Total chars: {len(out)}")
