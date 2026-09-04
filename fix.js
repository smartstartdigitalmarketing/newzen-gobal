const fs = require("fs");
let content = fs.readFileSync("products.html", "utf-8");

const cardRegex = /<div class="product-img-card" onclick="openContentModal\('modal-([^']+)'([\s\S]*?)<img src="([^"]+)"[\s\S]*?<h3 class="product-card-title">(.*?)<\/h3>/g;

let matches;
while ((matches = cardRegex.exec(content)) !== null) {
    let pageBase = matches[1];
    let modalId = "modal-" + pageBase;
    let innerPage = pageBase + ".html";
    let image = matches[3];
    let title = matches[4];
    
    try {
        let innerContent = fs.readFileSync(innerPage, "utf-8");
        
        let overview = "";
        let overviewMatch = innerContent.match(/<div class="detail-overview-col">([\s\S]*?)<\/section>/);
        if (!overviewMatch) {
            overviewMatch = innerContent.match(/<div class="detail-overview-col">([\s\S]*?)<\/div>\s*<!-- RIGHT:/);
        }
        
        if (overviewMatch) {
            overview = overviewMatch[1];
            overview = overview.replace(/<div class="sticky-contact-card[\s\S]*/, "");
        }
        
        let modalReplacement = `<div class="content-modal-overlay" id="${modalId}">
  <div class="content-modal-box">
    <button class="content-modal-close" onclick="closeContentModal('${modalId}')">&times;</button>
    <div class="content-modal-left">
      <img src="${image}" alt="${title}">
    </div>
    <div class="content-modal-right">
      <h2 class="content-modal-title">${title}</h2>
      <div class="content-modal-body">
        ${overview}
      </div>
    </div>
  </div>
</div>`;
        
        let modalPattern = new RegExp(`<div class="content-modal-overlay" id="${modalId}">[\\s\\S]*?</div>\\s*</div>\\s*</div>`, "g");
        content = content.replace(modalPattern, modalReplacement);
        
    } catch (err) {
        console.error("Error on " + innerPage + ": " + err);
    }
}

fs.writeFileSync("products.html", content, "utf-8");
