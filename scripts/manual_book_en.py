#!/usr/bin/env python3
"""
manual_book_en.py - English Operations Manual & System Architecture
Document Type: Corporate Technical Report & Operational Standard (A4 Portrait)
Editorial Standards:
- Pure white background, high-contrast dark text (#111827 / #1F2937), botanical green accent (#1B4332).
- Zero AI-slop visual boxes, zero badges, zero gradients, zero shadows.
- Clean structured tables for all 24 seasonal blends (Spring, Summer, Autumn, Winter).
- Linear transaction flow diagram (thin borders, clean arrows).
- Standard SOP procedure format (Procedure Name, Purpose, Steps 1-2-3, Important Notes).
- Official web logo (logo_new.png) and the 5 official Co-Founders.
- Zero asterisks (*), zero mention of OXID, zero user personal name.
"""

def generate_manual_book_en(assets: dict) -> str:
    founders = assets.get("founders", [])
    solar_terms = assets.get("solar_terms", [])
    logo_b64 = assets.get("logo", "")

    # Group the 24 products into 4 seasons
    seasons_meta = [
        {
            "id": "spring",
            "name": "Spring Season (春季)",
            "sub": "Solar Terms 01 to 06",
            "desc": "Characterized by fresh, light floral notes and young botanical shoots to awaken vitality and support natural metabolic renewal."
        },
        {
            "id": "summer",
            "name": "Summer Season (夏季)",
            "sub": "Solar Terms 07 to 12",
            "desc": "Featuring cooling mountain mint, native citrus, and soothing flowers designed for active hydration and biological heat dispersion."
        },
        {
            "id": "autumn",
            "name": "Autumn Season (秋季)",
            "sub": "Solar Terms 13 to 18",
            "desc": "Rich in sweet cinnamon bark, whole chamomile blossoms, and roasted grains to ground the nervous system and promote restorative evening calm."
        },
        {
            "id": "winter",
            "name": "Winter Season (冬季)",
            "sub": "Solar Terms 19 to 24",
            "desc": "Anchored by mature red ginger, aromatic archipelago cloves, and wild forest honey to provide deep warmth and sustain immune resilience."
        }
    ]

    # Generate Catalog Tables per Season
    catalog_sections_html = ""
    global_idx = 1
    for sm in seasons_meta:
        items = [t for t in solar_terms if t.get("season") == sm["id"]]
        table_rows = ""
        for it in items:
            ingr_str = ", ".join(it.get("ingredients", []))
            thumb_img = ""
            if it.get("thumb_b64"):
                thumb_img = f'<img src="{it["thumb_b64"]}" style="width: 28px; height: 28px; object-fit: cover; border: 1px solid #D1D5DB; vertical-align: middle; margin-right: 6px; display: inline-block;" alt="{it["term"]}">'
            
            # Map extraction parameters based on blend ingredients
            if "jasmine" in ingr_str.lower() or "green" in ingr_str.lower():
                brew_param = "82°C • 3.5 Min"
            elif "ginger" in ingr_str.lower() or "cinnamon" in ingr_str.lower():
                brew_param = "98°C • 6.0 Min"
            elif "chamomile" in ingr_str.lower() or "rose" in ingr_str.lower() or "hibiscus" in ingr_str.lower():
                brew_param = "92°C • 5.0 Min"
            else:
                brew_param = "88°C • 4.0 Min"

            table_rows += f"""
            <tr>
                <td style="text-align: center; font-weight: 600; color: #4B5563;">{global_idx:02d}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        {thumb_img}
                        <div>
                            <strong>{it.get('term')}</strong><br>
                            <span style="font-size: 8pt; color: #4B5563;">{it.get('termChinese')}</span>
                        </div>
                    </div>
                </td>
                <td style="font-weight: 600; color: #111827;">{it.get('blend')}</td>
                <td style="font-size: 8.5pt; color: #374151;">{ingr_str}</td>
                <td style="font-size: 8.5pt; text-align: center; color: #4B5563; white-space: nowrap;">{brew_param}</td>
                <td style="text-align: center; white-space: nowrap; font-size: 8.5pt; font-weight: 500;">
                    Hot {it.get('hotPrice')}<br>
                    <span style="color: #4B5563;">Iced {it.get('icedPrice')}</span>
                </td>
                <td style="font-size: 8.5pt; color: #4B5563;">{it.get('note')}</td>
            </tr>
            """
            global_idx += 1

        catalog_sections_html += f"""
        <div style="margin-top: 14pt; page-break-inside: avoid;">
            <div style="font-size: 11pt; font-weight: 700; color: #1B4332; margin-bottom: 2pt; border-bottom: 1px solid #1B4332; padding-bottom: 3pt;">
                {sm['name']} — <span style="font-weight: 500; font-size: 9.5pt; color: #4B5563;">{sm['sub']}</span>
            </div>
            <p style="font-size: 9pt; color: #4B5563; margin-top: 3pt; margin-bottom: 6pt;">{sm['desc']}</p>
            <table class="editorial-table">
                <thead>
                    <tr>
                        <th style="width: 5%; text-align: center;">No</th>
                        <th style="width: 23%;">Solar Term</th>
                        <th style="width: 17%;">Blend Formulation</th>
                        <th style="width: 23%;">Primary Ingredients</th>
                        <th style="width: 13%; text-align: center;">Brew Standard</th>
                        <th style="width: 10%; text-align: center;">Price</th>
                        <th style="width: 19%;">Flavor Profile &amp; Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {table_rows}
                </tbody>
            </table>
        </div>
        """

    # Generate Founders Rows for Cover and Introduction
    founders_rows = ""
    for idx, f in enumerate(founders, 1):
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
<title>CHANGKEER ATELIER — OPERATIONS MANUAL &amp; SYSTEM ARCHITECTURE</title>
<style>
@page {{
    size: A4 portrait;
    margin: 22mm 20mm 22mm 20mm;
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
        content: "OPERATIONS MANUAL &amp; SYSTEM ARCHITECTURE";
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 8pt;
        font-weight: 500;
        color: #4B5563;
    }}
    @bottom-left {{
        content: "Official Operating Manual • CHANGKEER Board of Founders";
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 8pt;
        color: #6B7280;
    }}
    @bottom-right {{
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 8pt;
        font-weight: 600;
        color: #111827;
    }}
}}

@page:first {{
    margin: 20mm 20mm 18mm 20mm;
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
    font-size: 9.5pt;
    line-height: 1.55;
    color: #1F2937;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
}}

/* Typography Hierarchy */
.chapter-num {{
    font-size: 9.5pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #1B4332;
    margin-bottom: 2pt;
}}

h1 {{
    font-size: 18pt;
    font-weight: 700;
    line-height: 1.25;
    color: #111827;
    margin-top: 0;
    margin-bottom: 8pt;
    border-bottom: 1.5px solid #1B4332;
    padding-bottom: 4pt;
    page-break-after: avoid;
}}

h2 {{
    font-size: 12pt;
    font-weight: 700;
    line-height: 1.35;
    color: #111827;
    margin-top: 14pt;
    margin-bottom: 5pt;
    page-break-after: avoid;
}}

h3 {{
    font-size: 10pt;
    font-weight: 700;
    line-height: 1.35;
    color: #1B4332;
    margin-top: 10pt;
    margin-bottom: 4pt;
    page-break-after: avoid;
}}

p {{
    margin-top: 0;
    margin-bottom: 7pt;
    text-align: justify;
    color: #1F2937;
}}

/* Standard Lists */
ul {{
    list-style-type: disc;
    margin-top: 3pt;
    margin-bottom: 8pt;
    padding-left: 18px;
}}

ul li {{
    margin-bottom: 3pt;
    line-height: 1.5;
    color: #1F2937;
}}

ol {{
    margin-top: 3pt;
    margin-bottom: 8pt;
    padding-left: 18px;
}}

ol li {{
    margin-bottom: 3pt;
    line-height: 1.5;
    color: #1F2937;
}}

/* Table Standards */
.editorial-table {{
    width: 100%;
    border-collapse: collapse;
    margin-top: 6pt;
    margin-bottom: 10pt;
    font-size: 9pt;
    page-break-inside: auto;
}}

.editorial-table thead {{
    display: table-header-group;
}}

.editorial-table tr {{
    page-break-inside: avoid;
}}

.editorial-table th {{
    background-color: #F9FAFB;
    color: #111827;
    font-weight: 700;
    text-align: left;
    padding: 6pt 7pt;
    border-top: 1px solid #D1D5DB;
    border-bottom: 1.5px solid #1B4332;
    border-left: 1px solid #E5E7EB;
    border-right: 1px solid #E5E7EB;
    font-size: 8.5pt;
}}

.editorial-table td {{
    padding: 5.5pt 7pt;
    border-bottom: 1px solid #E5E7EB;
    border-left: 1px solid #E5E7EB;
    border-right: 1px solid #E5E7EB;
    vertical-align: top;
    line-height: 1.4;
}}

.editorial-table tbody tr:nth-child(even) {{
    background-color: #FFFFFF;
}}

/* SOP Procedures */
.sop-block {{
    margin-top: 8pt;
    margin-bottom: 12pt;
    page-break-inside: avoid;
}}

.sop-title {{
    font-size: 10.5pt;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2pt;
}}

.sop-purpose {{
    font-size: 9pt;
    color: #4B5563;
    font-style: italic;
    margin-bottom: 4pt;
}}

.sop-steps {{
    margin-top: 2pt;
    margin-bottom: 4pt;
    padding-left: 18px;
}}

.sop-note {{
    font-size: 8.5pt;
    color: #1F2937;
    background-color: #F9FAFB;
    border-left: 3px solid #1B4332;
    padding: 4pt 8pt;
    margin-top: 4pt;
}}

/* Linear Workflow Diagram */
.workflow-container {{
    display: table;
    width: 100%;
    table-layout: fixed;
    margin: 10pt 0 12pt 0;
}}

.workflow-node {{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    border: 1px solid #D1D5DB;
    background-color: #F9FAFB;
    padding: 7pt 5pt;
    font-size: 8pt;
    line-height: 1.3;
}}

.workflow-node-num {{
    font-weight: 700;
    font-size: 7.5pt;
    color: #1B4332;
    text-transform: uppercase;
    margin-bottom: 2pt;
}}

.workflow-node-title {{
    font-weight: 600;
    color: #111827;
}}

.workflow-arrow-cell {{
    display: table-cell;
    width: 18px;
    vertical-align: middle;
    text-align: center;
    font-size: 12pt;
    color: #6B7280;
    font-weight: bold;
}}

.page-break {{
    page-break-before: always;
}}
</style>
</head>
<body>

<!-- COVER PAGE -->
<div style="min-height: 245mm; display: flex; flex-direction: column; justify-content: space-between;">
    <div>
        <!-- Brand Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #1B4332; padding-bottom: 8pt; margin-bottom: 24pt;">
            <div style="display: flex; align-items: center;">
                <img src="{logo_b64}" style="height: 38px; width: auto; margin-right: 12pt; display: block;" alt="CHANGKEER Logo">
                <div>
                    <div style="font-size: 13pt; font-weight: 800; letter-spacing: 0.06em; color: #1B4332; text-transform: uppercase;">CHANGKEER ATELIER</div>
                    <div style="font-size: 8pt; color: #4B5563; text-transform: uppercase; letter-spacing: 0.05em;">Artisan Herbal Tea &amp; Botanical Laboratory</div>
                </div>
            </div>
            <div style="text-align: right; font-size: 8pt; color: #6B7280;">
                <div>OFFICIAL DOCUMENT</div>
                <div style="font-weight: 700; color: #111827;">2026 EDITION</div>
            </div>
        </div>

        <!-- Document Title Block -->
        <div style="margin-top: 30pt; margin-bottom: 28pt;">
            <div style="font-size: 9pt; font-weight: 700; color: #1B4332; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6pt;">
                OPERATIONS MANUAL &amp; SYSTEM ARCHITECTURE
            </div>
            <div style="font-size: 24pt; font-weight: 800; line-height: 1.2; color: #111827; margin-bottom: 10pt;">
                STANDARD OPERATING PROCEDURES &amp; SYSTEM MANUAL
            </div>
            <div style="font-size: 11pt; line-height: 1.45; color: #4B5563; max-width: 90%;">
                Retail Operating Standards, Digital Transaction Governance, 24 Solar Terms Botanical Formulations, and Cloud E-Commerce Cafe Architecture.
            </div>
        </div>

        <!-- Document Metadata Table -->
        <div style="margin-top: 20pt; margin-bottom: 24pt;">
            <table class="editorial-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th colspan="2" style="font-size: 9pt;">DOCUMENT IDENTIFICATION &amp; METADATA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width: 32%; font-weight: 600; color: #374151;">Document Identification Code</td>
                        <td style="font-family: monospace; font-size: 9pt; color: #111827;">DOC-CKR-OPS-2026-V2-EN</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #374151;">Classification &amp; Distribution</td>
                        <td>Official Operating Standard (Internal Staff &amp; Academic/Business Review)</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #374151;">Release Version &amp; Effective Date</td>
                        <td>Version 2.1 (Comprehensive Editorial Revision) — October 2026</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #374151;">Publishing Authority</td>
                        <td>Board of Founders, CHANGKEER ATELIER (5 Co-Founders)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Official Board of Founders Table -->
    <div>
        <div style="font-size: 9.5pt; font-weight: 700; color: #1B4332; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4pt;">
            CHANGKEER BOARD OF FOUNDERS (THE 5 CO-FOUNDERS)
        </div>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 6%; text-align: center;">No</th>
                    <th style="width: 30%;">Founder Name</th>
                    <th style="width: 16%;">Role</th>
                    <th>Executive Operational Focus</th>
                </tr>
            </thead>
            <tbody>
                {founders_rows}
            </tbody>
        </table>

        <div style="font-size: 8pt; color: #6B7280; text-align: center; margin-top: 10pt; border-top: 1px solid #E5E7EB; padding-top: 6pt;">
            CHANGKEER ATELIER • West Java &amp; Jakarta, Indonesia • All Rights Reserved.
        </div>
    </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="page-break">
    <div class="chapter-num">Executive Summary</div>
    <h1>Document Structure &amp; Table of Contents</h1>

    <p style="margin-bottom: 12pt;">
        This document serves as an authoritative operating reference for atelier staff, baristas, retail cashiers, technology operators, and academic/business evaluators. All content is organized systematically and supported by rigorous technical and operational evidence.
    </p>

    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 14%; text-align: center;">Chapter</th>
                <th style="width: 46%;">Chapter Title &amp; Scope of Coverage</th>
                <th style="width: 40%;">Core Operational Focus</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">CHAPTER 01</td>
                <td><strong>Concept, Business Identity &amp; Vision</strong></td>
                <td>Brand profile, 24 Solar Terms (Jieqi) philosophy, tisane rationale, and the 5 Co-Founders structure.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">CHAPTER 02</td>
                <td><strong>System Architecture &amp; Technology Ecosystem</strong></td>
                <td>End-to-end system workflow, modern tech stack, dual-tier fault tolerance, and offline cache resilience.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">CHAPTER 03</td>
                <td><strong>Complete Catalog of 24 Seasonal Blends</strong></td>
                <td>Comprehensive formulation tables across 4 seasons, water temperatures, official pricing, and customization.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">CHAPTER 04</td>
                <td><strong>Transaction Governance &amp; Dynamic QRIS</strong></td>
                <td>Linear ordering workflow, dynamic QRIS security, server-side anti-tampering, and idempotency locks.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">CHAPTER 05</td>
                <td><strong>Barista Standard Operating Procedures (SOP)</strong></td>
                <td>KDS touch-monitor ticket handling, precision brewing temps and timing, calibrated sweetness, and bar hygiene.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">CHAPTER 06</td>
                <td><strong>Cashier Standard Operating Procedures (SOP)</strong></td>
                <td>Counter POS order flow, payment troubleshooting matrix, refund policies, and daily cash reconciliation.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">CHAPTER 07</td>
                <td><strong>Store Administration &amp; Layman Glossary</strong></td>
                <td>Rapid inventory stock toggling (/admin) and accessible glossary for non-technical evaluators.</td>
            </tr>
        </tbody>
    </table>
</div>

<!-- CHAPTER 1 -->
<div class="page-break">
    <div class="chapter-num">Chapter 01 • Business Concept &amp; Identity</div>
    <h1>Understanding CHANGKEER &amp; The 24 Seasons</h1>

    <h2>1.1 Enterprise Profile &amp; Core Values</h2>
    <p>
        <strong>CHANGKEER ATELIER</strong> is a contemporary artisan herbal tea atelier and botanical laboratory that harmonizes the indigenous medicinal flora of the Indonesian archipelago with the ancient wisdom of the 24 Solar Terms (<em>24 Jieqi</em>). Unlike fast-paced commercial coffee chains high in stimulants or conventional folk medicine stalls lacking standardization, CHANGKEER provides a serene sanctuary for mindful hydration, calibrated extraction, and holistic well-being.
    </p>
    <p>
        Botanically, all CHANGKEER infusions are classified as <strong>Tisanes</strong>—pure extractions of whole culinary herbs, rhizomes, and botanical flower petals—entirely free of black tea leaves, synthetic flavoring essences, and refined chemicals. This ensures that every formulation is gentle on sensitive digestion and completely non-stimulant, making it suitable for any hour of the day without disrupting sleep quality.
    </p>

    <h2>1.2 The Philosophy of 24 Solar Terms (Jieqi)</h2>
    <p>
        Human biology exhibits clear circadian and seasonal responses to climatic transitions. During scorching heatwaves, internal organs benefit from botanical agents that disperse metabolic heat. Conversely, during torrential monsoons and cold drafts, volatile essential oils from rhizomes are needed to stimulate peripheral blood circulation and prevent physical fatigue.
    </p>
    <p>
        CHANGKEER organizes its 24 signature formulations across four primary seasonal pillars:
    </p>
    <ul>
        <li><strong>Spring Season (春季):</strong> Light floral compositions that awaken vital organ function and gently cleanse metabolic residues after seasonal dormancy.</li>
        <li><strong>Summer Season (夏季):</strong> Mountain peppermint, butterfly pea, and native citrus designed to lower core temperature and provide thirst-quenching hydration.</li>
        <li><strong>Autumn Season (秋季):</strong> Whole chamomile blossoms, tropical cinnamon bark, and sun-dried pears to soothe psychological tension and promote deep sleep.</li>
        <li><strong>Winter Season (冬季):</strong> Aged red ginger, cloves, and wild raw honey to deliver penetrating internal warmth and bolster immune resilience.</li>
    </ul>

    <h2>1.3 The Rationale for a Self-Service Digital Platform</h2>
    <p>
        Brewing premium botanical tisanes requires absolute precision regarding water temperature and infusion timing. If baristas are repeatedly interrupted by taking manual orders on paper chits or making change with cash, beverage quality suffers immediately. CHANGKEER's self-service web ordering platform empowers guests to customize their brews directly from their table via smartphone, enabling baristas to dedicate 100% of their focus to artisanal craftsmanship.
    </p>
</div>

<!-- CHAPTER 2 -->
<div class="page-break">
    <div class="chapter-num">Chapter 02 • System Architecture</div>
    <h1>System Architecture &amp; Technology Ecosystem</h1>

    <h2>2.1 Integrated Architectural Principles</h2>
    <p>
        The CHANGKEER software platform is engineered with modern web standards, prioritizing instant loading speeds, banking-grade transactional integrity, and effortless bar-station operation. Guests access the entire menu directly in their mobile browser without downloading native apps.
    </p>

    <h2>2.2 Selected Technology Stack</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 24%;">Architectural Tier</th>
                <th style="width: 26%;">Chosen Technology</th>
                <th>Engineering Justification &amp; Operational Benefit</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Primary Web Application</strong></td>
                <td>Next.js 16 (React 19, App Router)</td>
                <td>Instant mobile page renders with zero bundle bloat; fast server-side generation for static menu catalogs.</td>
            </tr>
            <tr>
                <td><strong>Programming Language</strong></td>
                <td>TypeScript 5 (Strict Mode)</td>
                <td>Eliminates runtime type errors during development, safeguarding financial math, voucher logic, and recipe data.</td>
            </tr>
            <tr>
                <td><strong>User Interface &amp; Styling</strong></td>
                <td>Tailwind CSS</td>
                <td>Ergonomic touch targets, clean typographic hierarchy, zero extraneous decoration, and full responsive behavior across devices.</td>
            </tr>
            <tr>
                <td><strong>Database &amp; Data Layer</strong></td>
                <td>PostgreSQL (via Supabase)</td>
                <td>Relational consistency with full ACID compliance and Row-Level Security (RLS) to protect transactional records and customer privacy.</td>
            </tr>
            <tr>
                <td><strong>Data Validation Layer</strong></td>
                <td>Zod Schema Validation</td>
                <td>Guarantees that every incoming HTTP order payload matches exact schema constraints before server execution.</td>
            </tr>
        </tbody>
    </table>

    <h2>2.3 Dual-Tier Fault Tolerance &amp; Offline Resilience</h2>
    <p>
        To protect retail store operations against unexpected internet interruptions, the architecture features a dual-tier storage strategy. Active table orders are mirrored in high-resilience local cache memory at the bar terminal, guaranteeing that the barista ticket queue and receipt printing function seamlessly even during severe ISP connectivity lag.
    </p>
</div>

<!-- CHAPTER 3 -->
<div class="page-break">
    <div class="chapter-num">Chapter 03 • Product Catalog</div>
    <h1>Complete Catalog of 24 Seasonal Blends</h1>

    <p>
        Below is the authoritative documentation of ingredient formulations, water extraction standards, and official retail pricing for all 24 CHANGKEER ATELIER botanical tisanes:
    </p>

    {catalog_sections_html}

    <div style="margin-top: 14pt; page-break-inside: avoid;">
        <h2>3.2 Standardized Customization Options</h2>
        <p>Guests may calibrate each brew to their personal preferences according to the following official parameters:</p>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Customization Axis</th>
                    <th style="width: 35%;">Available Options</th>
                    <th>Operational Notes &amp; Surcharge</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Serving Temperature</strong></td>
                    <td>Hot Ceramic Tea Pot / Iced Shaken Tea</td>
                    <td>Traditional ceramic hot infusion (standard) or craft iced shaken tea with crystal ice cubes (+IDR 2,000).</td>
                </tr>
                <tr>
                    <td><strong>Natural Sweetener Level</strong></td>
                    <td>0%, 30%, 50%, 75%, 100%</td>
                    <td>Accurately calibrated wild honey or pure sorghum nectar dispensed via jigger. Completely free of artificial sugars.</td>
                </tr>
                <tr>
                    <td><strong>Dried Flower Toppings</strong></td>
                    <td>Rose Buds, Chrysanthemum, Butterfly Pea, Jasmine, Osmanthus, Hibiscus (+IDR 3,000 – 4,000)</td>
                    <td>Whole food-grade dried floral petals to elevate volatile aromas, visual infusion colors, and relaxation.</td>
                </tr>
                <tr>
                    <td><strong>Sun-Dried Fruit Toppings</strong></td>
                    <td>Goji Berries, Red Dates / Jujube, Longan, Pear, Apple, Mango, Lemon, Orange Peel (+IDR 2,000 – 4,000)</td>
                    <td>Unsweetened dehydrated fruit slices releasing wholesome natural fructose and vibrant fruit depth.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- CHAPTER 4 -->
<div class="page-break">
    <div class="chapter-num">Chapter 04 • Payment Security</div>
    <h1>Transaction Governance &amp; Dynamic QRIS</h1>

    <h2>4.1 End-to-End Digital Ordering Workflow</h2>
    <p>
        The transactional pipeline is strictly linear, spanning from guest table selection to beverage handover at the preparation counter:
    </p>

    <div class="workflow-container">
        <div class="workflow-node">
            <div class="workflow-node-num">Step 1</div>
            <div class="workflow-node-title">Guest Selects Menu</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Select blend &amp; customize in mobile browser</div>
        </div>
        <div class="workflow-arrow-cell">&rarr;</div>
        <div class="workflow-node">
            <div class="workflow-node-num">Step 2</div>
            <div class="workflow-node-title">System Locks Total</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Server generates dynamic, exact-amount QRIS</div>
        </div>
        <div class="workflow-arrow-cell">&rarr;</div>
        <div class="workflow-node">
            <div class="workflow-node-num">Step 3</div>
            <div class="workflow-node-title">Payment Verified</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Banking gateway confirms settlement</div>
        </div>
        <div class="workflow-arrow-cell">&rarr;</div>
        <div class="workflow-node">
            <div class="workflow-node-num">Step 4</div>
            <div class="workflow-node-title">Ticket Sent to KDS</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Recipe details appear on barista monitor</div>
        </div>
        <div class="workflow-arrow-cell">&rarr;</div>
        <div class="workflow-node">
            <div class="workflow-node-num">Step 5</div>
            <div class="workflow-node-title">Barista Crafts Brew</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Precision extraction according to SOP</div>
        </div>
        <div class="workflow-arrow-cell">&rarr;</div>
        <div class="workflow-node">
            <div class="workflow-node-num">Step 6</div>
            <div class="workflow-node-title">Order Handover</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Tea served &amp; ticket marked complete</div>
        </div>
    </div>

    <h2>4.2 Comparative Evaluation: Static Paper QRIS vs CHANGKEER Dynamic QRIS</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Evaluation Metric</th>
                <th style="width: 37%;">Static QRIS (Conventional Printed Sticker)</th>
                <th>CHANGKEER Dynamic QRIS</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Amount Input</strong></td>
                <td>Manually entered by guest; high risk of typing errors (omitted or added zeros).</td>
                <td>Cryptographically locked by server; exact bill amount rendered automatically.</td>
            </tr>
            <tr>
                <td><strong>Verification Speed</strong></td>
                <td>Cashier must physically inspect guest smartphone screen, causing checkout queues.</td>
                <td>Automated webhook confirmation; order updates across screens in under 2 seconds.</td>
            </tr>
            <tr>
                <td><strong>Fraud &amp; Fake Slip Risk</strong></td>
                <td>High; vulnerable to manipulated bank receipt screenshots or payment app simulators.</td>
                <td>Zero; server accepts fulfillment only upon direct webhook verification from payment gateway.</td>
            </tr>
        </tbody>
    </table>

    <h2>4.3 Server-Side Anti-Tampering Security</h2>
    <p>
        Many retail web applications suffer fraud from malicious browser parameter manipulation (e.g., using developer inspect tools). In CHANGKEER's architecture, unit prices <strong>are never trusted from the client device</strong>. Upon order submission, the server re-validates each item ID directly against the central master catalog. If any price discrepancy or tampering is detected, the transaction is immediately aborted by the security gateway.
    </p>

    <h2>4.4 Double-Debit Prevention (Idempotency Key)</h2>
    <p>
        When a guest encounters poor mobile reception and presses the pay button multiple times in rapid succession, the platform engages an <em>idempotency lock</em>. Each transaction is tagged with a unique cryptographic idempotency token ensuring that the underlying banking gateway will execute settlement exactly once.
    </p>
</div>

<!-- CHAPTER 5 -->
<div class="page-break">
    <div class="chapter-num">Chapter 05 • Barista Standards</div>
    <h1>Barista Standard Operating Procedures (SOP)</h1>

    <div class="sop-block">
        <div class="sop-title">SOP-BAR-01: Kitchen Display System (KDS) Ticket Management</div>
        <div class="sop-purpose">Purpose: Ensure all beverage orders are prepared strictly in FIFO queue order without confusion or delay.</div>
        <div style="font-weight: 600; font-size: 9pt; margin-top: 4pt;">Operational Steps:</div>
        <ol class="sop-steps">
            <li>Monitor the high-contrast KDS touch-screen stationed directly above the brewing counter.</li>
            <li>Identify new tickets marked with <strong>'Order Received' (Amber)</strong> and review recipe specifications: table number, blend name, water temperature, and sweetness level.</li>
            <li>Press the <strong>'Start Brew'</strong> button on the touch interface. The ticket color switches to <strong>'Brewing Now' (Blue)</strong> and the digital countdown timer begins.</li>
            <li>Upon timer completion, pour the finished infusion into the designated pre-warmed ceramic pot or iced shaker, then tap <strong>'Ready to Serve'</strong> to switch status to <strong>'Ready' (Green)</strong>.</li>
        </ol>
        <div class="sop-note">
            <strong>Mandatory Rule:</strong> Baristas must not bypass queue order unless explicitly instructed by the Shift Supervisor during peak rush management.
        </div>
    </div>

    <h2>5.2 Water Temperature &amp; Extraction Timing Standards</h2>
    <p>
        Different botanical tissue structures require specific water thermal envelopes to extract beneficial volatile oils without releasing bitter polyphenols:
    </p>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 28%;">Botanical Classification</th>
                <th style="width: 20%; text-align: center;">Ideal Water Temp</th>
                <th style="width: 20%; text-align: center;">Extraction Time</th>
                <th>Quality Assurance Guidelines</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Fresh Floral &amp; Green Tea</strong></td>
                <td style="text-align: center; font-weight: 600;">80°C – 85°C</td>
                <td style="text-align: center;">3.5 – 4.0 Min</td>
                <td>Use digital gooseneck variable-temp kettles; avoid boiling water to prevent thermal scorching of jasmine petals.</td>
            </tr>
            <tr>
                <td><strong>Dried Blossoms (Chamomile, Roselle)</strong></td>
                <td style="text-align: center; font-weight: 600;">90°C – 94°C</td>
                <td style="text-align: center;">5.0 Min Full</td>
                <td>Ensure petals are fully submerged to allow complete release of natural pigments and calming aromatics.</td>
            </tr>
            <tr>
                <td><strong>Rhizomes &amp; Roots (Red Ginger, Turmeric)</strong></td>
                <td style="text-align: center; font-weight: 600;">98°C – 100°C</td>
                <td style="text-align: center;">6.0 Min Full</td>
                <td>Full rolling boil required to break dense cellular walls and release therapeutic gingerols and essential oils.</td>
            </tr>
            <tr>
                <td><strong>Aromatic Bark &amp; Whole Seeds</strong></td>
                <td style="text-align: center; font-weight: 600;">95°C – 98°C</td>
                <td style="text-align: center;">5.5 Min Full</td>
                <td>Keep ceramic infusion lids firmly closed throughout extraction to prevent fragrant aromatic vapors from escaping.</td>
            </tr>
        </tbody>
    </table>

    <div class="sop-block">
        <div class="sop-title">SOP-BAR-02: Calibrated Natural Sweetener Dispensing</div>
        <div class="sop-purpose">Purpose: Maintain precise flavor consistency across all sweetness levels using calibrated stainless jiggers.</div>
        <div style="font-weight: 600; font-size: 9pt; margin-top: 4pt;">Standard Jigger Dispensing Matrix:</div>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Sweetness Level</th>
                    <th style="width: 25%;">Jigger Measure (ml)</th>
                    <th>Flavor Balance &amp; Beverage Character</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>0% (Unsweetened)</strong></td>
                    <td>0 ml</td>
                    <td>Pure herbal formulation; crisp, authentic botanical profiles with zero added sugar.</td>
                </tr>
                <tr>
                    <td><strong>30% (Light Sweetness)</strong></td>
                    <td>7.5 ml</td>
                    <td>Delicate honey finish on the palate; floral notes remain distinctly dominant.</td>
                </tr>
                <tr>
                    <td><strong>50% (Balanced / Standard)</strong></td>
                    <td>12.5 ml</td>
                    <td>Atelier benchmark; harmonious equilibrium between herbal notes and natural nectar sweetness.</td>
                </tr>
                <tr>
                    <td><strong>75% (Enhanced Sweetness)</strong></td>
                    <td>18.0 ml</td>
                    <td>Sweetness is prominent; recommended for tart hibiscus blends and iced shaken varieties.</td>
                </tr>
                <tr>
                    <td><strong>100% (Full Sweetness)</strong></td>
                    <td>25.0 ml</td>
                    <td>Rich and full-bodied; entirely throat-friendly thanks to 100% natural raw nectar sources.</td>
                </tr>
            </tbody>
        </table>
        <div class="sop-note">
            <strong>Mandatory Rule:</strong> Baristas must never pour sweeteners by eye. Always employ certified stainless steel jiggers.
        </div>
    </div>
</div>

<!-- CHAPTER 6 -->
<div class="page-break">
    <div class="chapter-num">Chapter 06 • Cashier Standards</div>
    <h1>Cashier Standard Operating Procedures &amp; Reconciliation</h1>

    <h2>6.1 Counter Cashier Responsibilities</h2>
    <p>
        While the majority of guests complete transactions autonomously via mobile QRIS at tables, counter cashiers play a critical role in assisting walk-in guests requesting cash settlement, operating counter POS terminals, troubleshooting bank gateway delays, and executing end-of-day store closing balances.
    </p>

    <h2>6.2 Payment Troubleshooting Matrix for Cashiers</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Operational Scenario</th>
                <th style="width: 32%;">Underlying Root Cause</th>
                <th>Standard Action Protocol</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>QRIS Code Fails to Scan</strong></td>
                <td>Guest screen brightness too low or camera lens smudged.</td>
                <td>Politely guide guest to increase screen brightness to 100%. If scanning continues to fail, generate an instant order chit at the counter POS.</td>
            </tr>
            <tr>
                <td><strong>Funds Debited, Status Stalled</strong></td>
                <td>National interbank clearing latency during peak processing hours.</td>
                <td>Verify successful debit notification on guest's banking app. Cross-reference transaction ID, then press 'Manual Settle' on the cashier terminal.</td>
            </tr>
            <tr>
                <td><strong>Accidental Menu Item Selection</strong></td>
                <td>Guest confirmed cart hurriedly on personal device.</td>
                <td>Provided the barista has not yet tapped 'Start Brew' on the KDS, the cashier may cancel the item in the terminal and issue the correct replacement.</td>
            </tr>
        </tbody>
    </table>

    <div class="sop-block">
        <div class="sop-title">SOP-CAS-01: End-of-Day Financial Reconciliation (Shift Closing)</div>
        <div class="sop-purpose">Purpose: Ensure 100% balance matching between physical drawer cash, digital QRIS settlements, and system sales totals.</div>
        <div style="font-weight: 600; font-size: 9pt; margin-top: 4pt;">Closing Procedure Steps:</div>
        <ol class="sop-steps">
            <li>At 21:45 WIB, lock order intake and print the daily executive sales summary from the <code>/admin</code> portal.</li>
            <li>Remove all physical currency from the cash drawer and count bank notes and coins systematically in the presence of the Shift Supervisor.</li>
            <li>Segregate the initial float fund (IDR 500,000) and place it securely into the designated float envelope.</li>
            <li>Compare remaining net physical cash against the 'Total Cash Revenue' figure reported by the POS system.</li>
            <li>Review the merchant payment gateway settlement batch report and verify against 'Total Digital Revenue'.</li>
            <li>Co-sign the Daily Reconciliation Log alongside the Shift Supervisor and deposit the reconciled cash into the store safe.</li>
        </ol>
        <div class="sop-note">
            <strong>Variance Tolerance:</strong> Cash variance policy is strict IDR 0 tolerance. Any discrepancy exceeding IDR 2,000 mandates an immediate item-by-item receipt audit.
        </div>
    </div>
</div>

<!-- CHAPTER 7 -->
<div class="page-break">
    <div class="chapter-num">Chapter 07 • Store Administration &amp; Glossary</div>
    <h1>Store Administration &amp; Layman Practical Glossary</h1>

    <h2>7.1 Rapid Botanical Stock Management (/admin)</h2>
    <p>
        Botanical harvest yields from partner tea gardens in Wonosobo, Garut, and Puncak fluctuate with mountain weather. Should a botanical ingredient deplete unexpectedly during trading hours, store supervisors can instantly toggle item availability:
    </p>
    <ol>
        <li>Access the administrative console at <code>/admin/inventory</code> using authorized supervisor credentials.</li>
        <li>Locate the target blend affected by the ingredient stock-out.</li>
        <li>Toggle the availability switch from <strong>'Available'</strong> to <strong>'Out of Stock'</strong>.</li>
        <li>Within 1 second, the item is grayed out across all table menus, preventing guest disappointment and ordering conflicts.</li>
    </ol>

    <h2>7.2 Practical Glossary for Non-Technical Evaluators</h2>
    <p>
        The table below provides straightforward, non-technical explanations for technological and botanical terminology utilized throughout CHANGKEER ATELIER:
    </p>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Technical / Herbal Term</th>
                <th style="width: 35%;">Plain-Language Explanation</th>
                <th>Real-World Atelier Application</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Dynamic QRIS</strong></td>
                <td>A smart banking payment barcode that comes pre-loaded with the exact bill amount, eliminating manual typing.</td>
                <td>A guest scans the table barcode and their banking app immediately shows the exact IDR 32,500 bill without typing errors.</td>
            </tr>
            <tr>
                <td><strong>Kitchen Display System (KDS)</strong></td>
                <td>A digital touchscreen order queue positioned at the brewing bar, replacing paper order tickets prone to liquid damage.</td>
                <td>The bar monitor automatically alerts the barista that Table 4 has ordered a Jasmine infusion at 50% sweetness.</td>
            </tr>
            <tr>
                <td><strong>Idempotency Lock</strong></td>
                <td>A banking protection mechanism ensuring that a customer's account is never charged twice if the pay button is tapped repeatedly.</td>
                <td>A guest with sluggish internet taps 'Pay' three times; the bank gateway debits their account exactly once.</td>
            </tr>
            <tr>
                <td><strong>Server-Side Anti-Tampering</strong></td>
                <td>A security system preventing malicious actors from altering drink prices through browser code modification.</td>
                <td>If an attacker alters a drink price from IDR 26,000 to IDR 1,000 in mobile code, the central server rejects the order instantly.</td>
            </tr>
            <tr>
                <td><strong>Botanical Tisane</strong></td>
                <td>Pure hot or cold infusions made exclusively from herbs, flowers, and spices without ordinary black tea leaves or caffeine.</td>
                <td>Refreshing red roselle or soothing honey chamomile that can be enjoyed late at night without heart palpitations.</td>
            </tr>
            <tr>
                <td><strong>Solar Terms (24 Jieqi)</strong></td>
                <td>The traditional division of the solar year into 24 astronomical points, matching herbal properties to bodily weather needs.</td>
                <td>Serving a cooling mint infusion during the peak midday heat of Summer Solstice (夏至).</td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 24pt; border-top: 1px solid #D1D5DB; padding-top: 10pt; text-align: center; font-size: 8.5pt; color: #4B5563;">
        <strong>OFFICIAL OPERATIONAL DOCUMENT — CHANGKEER ATELIER</strong><br>
        Published by the Board of Founders: Almaidah Chaerudin Putri, Annisha Humaira, Johana Abigael Rumbiak, Keyla Putri Adisty, Nursoleha Romadhoni.<br>
        All Rights Reserved. Official Brand &amp; Formula Copyright 2026.
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
    out = generate_manual_book_en(assets)
    print(f"English Manual Book generated. Total chars: {len(out)}")
