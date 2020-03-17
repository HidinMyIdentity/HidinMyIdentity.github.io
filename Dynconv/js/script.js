// Robert Roberts

// constants to not re-query
$process = $("#process");
$beginning = $("#beginning");


// init list of conversions
var conversions = [];
// Load conversions from JSON
$.ajax({
    'async': false,
    'global': false,
    'url': "data/core.json",
    'dataType': "json",
    'success': function (data) {
        conversions = data;
    }
});

/**
 * Chain together the calculations and output the result
 */
function Calculate() {
    let cur = $beginning.val();
    // If the input is invalid, enable the error class and break
    if (isNaN(cur))  {
        $beginning.toggleClass("error", true);
        return;
    }
    // Turn off the error
    $beginning.toggleClass("error", false);

    // For each selected object, we handle one iteration of the loop
    $("option:selected").each(function () {
        // Alias
        let t = $(this);
        // Multiplication/division value
        let val = t.val();
        // If we are going forwards...
        if ($(".forwards", t.parent().parent())[0].checked) {
            //... multiply
            cur *= val;
        } else {
            // otherwise, we divide
            cur /= val;
        }
    });
    // Set the output to the new value
    $("#output").val(cur);
}

/**
 * Toggles the visible direction of a forwards-checkbox
 */
function ToggleDirection() {
    let t = $(this);
    // If checked, change the pointing value to point forwards
    if (t[0].checked) {
        t.next().text("->")
    } else {
        t.next().text("<-")
    }
    // Recalculate
    Calculate();
}

/**
 * Adds a new processing line to the list
 */
function AddNewProcess() {
    // Build the main li element
    let newline = $("<li class='part'><br><input class='forwards' checked type='checkbox'><span class='indicator'>-></span> <button class='delete'>Delete</button></li>");
    // have the select separate to make it easier to add to
    let drop = $("<select class='option'></select>");
    // Binds the checkbox
    $(".forwards", newline).click(ToggleDirection);
    // Binds the delete button
    $(".delete", newline).click(function () {
        $(this).parent().remove();
        Calculate();
    });
    // Recalculate when a new value is chosen
    drop.change(() => {Calculate()});

    // chuck them in the DOM
    $process.append(newline);
    newline.prepend(drop);

    // Add the choices
    for (let eq of conversions) {
        drop.prepend($(`<option value="${eq[2]}">${eq[0]} <-> ${eq[1]}</option>`));
    }
    // Recalculate
    Calculate();
}

// Bind the changing of values to recalculate
$beginning.change(Calculate);


// Make the process list sortable
$process.sortable({update: Calculate});

// Bind the button to add another process
$("#addAnother").click(function () {
    AddNewProcess();
    Calculate();
});

// provide the first one
AddNewProcess();