// Robert Roberts

// Assoc array of the texts to use for each part
var texts = {
    "subdomain": "This is the subdomain. The owner of the domain has full control of subdomains, and can create " +
        "as many as desired, linking to different locations. Subdomains can also be chained as long as possible, having sub-sub domains, " +
        "sub-sub-sub domains, and continue that ad absurdum.\n",

    "domain": "This is the domain: the part that you buy when you purchase a domain name. You get to choose whatever you want for the first part, " +
        "but the last part (the TLD) you have to chose from a predetermined list. Prices vary by the TLD",

    "tld": "This is the top level domain (TLD). When purchasing a domain, you have a choice of TLDs, but cannot make your own. " +
        "TLDs are controlled by external entities that pay a lot of money to maintain their TLD. These entities can set their own rules and prices for their domains.\n" +
        "To better visualize this: the domain you buy is just a subdomain of the TLD. There is another, invisible, domain above everything that controls the whole system."
};

// Store the description <p> to save resources
let $desc = $("#desc");

// To be run when a part is clicked
function PartClick(e) {
    e.stopPropagation();
    let $clicked = $(this);
    let part = $clicked.attr("id");
    // Validate that the part is in there
    if (part in texts) {
        $desc.fadeOut(function () {
            $desc.text(texts[part]).fadeIn();
        });
    }
}

// Bind to each bit of the domain
$(".holder span").click(PartClick);