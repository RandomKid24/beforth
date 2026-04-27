<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>BEFORTH | System Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&amp;family=Inter:wght@300;400;500&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet" />
        <style type="text/css">
          :root {
            --color-cream: #F8FAFC;
            --color-slate: #0F172A;
            --color-deep-slate: #020617;
            --color-blue: #2563EB;
            --color-pale: #64748B;
          }

          body {
            background-color: var(--color-cream);
            color: var(--color-slate);
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 4.236rem 10%;
            font-weight: 300;
            line-height: 1.618;
            -webkit-font-smoothing: antialiased;
          }

          .container {
            max-width: 80rem;
            margin: 0 auto;
          }

          .pill-tag {
            display: inline-flex;
            align-items: center;
            padding: 0.618rem 1rem;
            border-radius: 9999px;
            background-color: rgba(37, 99, 235, 0.1);
            border: 1px solid rgba(37, 99, 235, 0.4);
            color: var(--color-slate);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 1.618rem;
          }

          .indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--color-blue);
            margin-right: 12px;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }

          h1 {
            font-family: 'Bebas Neue', display;
            font-size: clamp(3.5rem, 8vw, 6rem);
            text-transform: uppercase;
            color: var(--color-slate);
            margin: 0 0 1.618rem 0;
            line-height: 1.05;
            letter-spacing: 0.02em;
          }
          
          h1 .outline {
            display: block;
            color: transparent;
            -webkit-text-stroke: 1.5px var(--color-slate);
          }

          p.desc {
            color: var(--color-pale);
            font-size: 1.2rem;
            margin-bottom: 4.236rem;
            max-width: 42.36rem;
            font-weight: 300;
          }

          .table-wrapper {
            background-color: #FFFFFF;
            border: 1px solid rgba(15, 23, 42, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
            overflow: hidden;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--color-blue);
            text-align: left;
            padding: 2.618rem 1.618rem 1.618rem;
            border-bottom: 1px solid rgba(15, 23, 42, 0.1);
            background-color: #FFFFFF;
          }

          td {
            padding: 1.618rem;
            border-bottom: 1px solid rgba(15, 23, 42, 0.05);
            font-family: 'Inter', sans-serif;
            color: var(--color-pale);
            transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          }

          tr {
            transition: background-color 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          }

          tr:last-child td {
            border-bottom: none;
          }

          /* Clean Service Grid Hover Effect */
          tr:hover td {
            background-color: var(--color-deep-slate);
            color: var(--color-pale);
          }

          tr:hover a {
            color: #FFFFFF;
            transform: translateX(8px);
          }

          a {
            display: inline-block;
            color: var(--color-slate);
            text-decoration: none;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          }

          tr:hover a:hover {
            color: var(--color-blue);
          }

          .data-mono {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="pill-tag">
            <div class="indicator"></div>
            SYSTEM INDEX
          </div>
          
          <h1>
            <span class="block">XML SITEMAP</span>
            <span class="outline">DIRECTORY.</span>
          </h1>
          
          <p class="desc">A structured map of all indexed pages within the BEFORTH ecosystem. Optimized for search engines and designed for humans.</p>
          
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>URL PATH</th>
                  <th>PRIORITY</th>
                  <th>FREQ.</th>
                  <th>LAST MODIFIED</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}" target="_blank">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td class="data-mono">
                      <xsl:value-of select="sitemap:priority"/>
                    </td>
                    <td class="data-mono">
                      <xsl:value-of select="sitemap:changefreq"/>
                    </td>
                    <td class="data-mono">
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
