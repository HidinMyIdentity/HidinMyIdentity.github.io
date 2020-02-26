// Robert Roberts

// Some constants
var speed = 5;
var easing = "swing";

/**
 * Hacky little fix to easily get a z-index
 * @return {number}
 */
function GetDepth(deg) {
    deg = Math.abs(parseInt(deg));
    // 180 degrees is the back, 90/270 is the middle, and 0 is the front
    switch (deg) {
        case 0:
            return 5;
        case 90:
        case 270:
            return 3;
        case 180:
            return 1;
    }
}

/**
 * Another hacky little fix to trigger a z-index change at the end of the animation
 * @param parent Element to work on
 * @param i Iteration of the loop
 */
function IndexTrigger(parent, i) {
    // Be safe
    i = Math.abs(i);
    // Disable the buttons at the beginning of the animtion
    if (i === 0) {
        $("button").attr("disabled", true);
    // At 50% of the animation, we want to increase the z-index to prevent weird overlaps
    } else if (i % 90 === 45) {
        // The setting of this value will be done by the time that the animation finishes.
        parent.css("z-index", GetDepth(parent.attr("data-deg")));
    } else if (i === 89) {
        $("button").attr("disabled", false);
    }
}


function SpinFrame(parent, i, deg) {
    // Calculate radians from the degrees
    let rads = deg * (Math.PI / 180);
    // This abomination of code queues up an animation to move the element in the path of a circle
    // the first part is just the position, and the last lambda function animates the blur and scaling.
    // You apparently cannot animate either of these two attributes, so at the end of the tiny base animation,
    // it applies the .css change at the end
    parent.animate({left: `${42.5 + ((25 + rads) * Math.sin(rads))}%`}, speed, easing,
        ()=>{
            parent.css({filter: `blur(${(1-Math.cos(rads))*2}px)`, transform: `scale(${0.75+(Math.cos(rads)/4)})`});
            // Run each change to determine if it is 50% of the way done, and if so, change the z-index
            IndexTrigger(parent, i)
        })
}

/**
 * Spin an element to the right. Meant to be  called sequentially on each box class
 */
function SpinForward() {
    // Load up the element we are working on
    let parent = $(this);
    // Get the position in degrees from the element's data-deg attribute
    let basedeg = parseInt(parent.attr("data-deg"));
    // Loop 90 times, one for each degree
    for (let i = 0; i < 90; i+= 1) {
        // get the full degrees
        let deg = basedeg + i;
        // Speen!
        SpinFrame(parent, i, deg)
    }
    // Change the degree attribute on the box by 90 degrees, and keep it in the bounds of 360 degrees
    parent.attr("data-deg", (parseInt(parent.attr("data-deg")) + 90) % 360);
}

/**
 * Spin an element to the left. Meant to be  called sequentially on each box class
 */
function SpinBackward() {
    // Get the box we are working on
    let parent = $(this);
    // What degree are we working from?
    let basedeg = parseInt(parent.attr("data-deg"));
    // Loop over each degree
    for (let i = 0; i < 90; i+= 1) {
        // Get the modified degree
        let deg = basedeg - i;
        // Speen!
        SpinFrame(parent, i, deg);
    }
    // Change the degree attribute on the box by 90 degrees, and keep it in the bounds of 360 degrees
    parent.attr("data-deg", (parent.attr("data-deg") - 90) % 360);
}

// Register button events via jQuery
$(".next").click(
    function () {
        $(".box").each(
            SpinForward
        )
    }
);

$(".back").click(
    function () {
        $(".box").each(
            SpinBackward
        )
    }
);

// Put boxes into place
$(".box").each(
    function() {
        let parent = $(this);
        let rads = parseInt(parent.attr("data-deg")) * (Math.PI / 180);
        parent.css({left: `${42.5 + ((25 + rads) * Math.sin(rads))}%`,
                            filter: `blur(${(1-Math.cos(rads))*2}px)`, transform: `scale(${0.75+(Math.cos(rads)/4)}`});
        parent.css("z-index", 4-(parent.attr("data-deg") / 90));
        IndexTrigger(parent, 45)
    }
);