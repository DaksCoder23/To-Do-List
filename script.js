$(document).ready(function() {
    // Enable sorting with jQuery UI
    $("#taskList").sortable();

    // Dark Mode Toggle
    $("#darkModeToggle").click(function() {
        $("body").toggleClass("dark");
        let mode = $("body").hasClass("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
        $(this).text(mode);
    });

    // Function to add a new task
    function addTask() {
        let taskText = $("#taskInput").val().trim();
        let deadline = $("#deadline").val();

        if (taskText === "" || deadline === "") {
            alert("Enter a task and deadline!");
            return;
        }

        let deadlineDate = new Date(deadline);
        let now = new Date();
        if (deadlineDate <= now) {
            alert("Please enter a future deadline!");
            return;
        }

        let taskItem = $("<li class='task'></li>").html(`<span>${taskText}</span>`);
        let timeLeft = $("<span class='timeLeft'></span>");

        // Update countdown
        updateTimeLeft(timeLeft, deadlineDate);

        // Add close button
        let closeBtn = $("<span class='close'>&times;</span>");
        taskItem.append(timeLeft, closeBtn);

        // Click event to toggle completion
        taskItem.click(function() {
            $(this).toggleClass("done");
        });

        // Click event to remove task
        closeBtn.click(function(event) {
            event.stopPropagation();
            $(this).parent().fadeOut(300, function() {
                $(this).remove();
            });
        });

        // Append task to list
        $("#taskList").prepend(taskItem);

        // Clear input fields
        $("#taskInput").val("");
        $("#deadline").val("");

        // Start updating the countdown timer every second
        setInterval(() => {
            updateTimeLeft(timeLeft, deadlineDate);
        }, 1000);
    }

    // Click event for adding task
    $("#addTaskBtn").click(addTask);

    // Press Enter to add task
    $("#taskInput").keypress(function(event) {
        if (event.which === 13) {
            addTask();
        }
    });

    // Enable jQuery Sortable for drag and drop
    $("#taskList").sortable({
        axis: "y",
        containment: "parent",
        opacity: 0.8,
        cursor: "move"
    }).disableSelection();
});

// Function to update countdown
function updateTimeLeft(element, deadline) {
    let now = new Date();
    let timeDiff = deadline - now;

    if (timeDiff <= 0) {
        element.text("⏳ Time's Up!");
        element.parent().addClass("overdue");
        return;
    }

    let hours = Math.floor(timeDiff / (1000 * 60 * 60));
    let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    element.text(`⏳ ${hours}h ${minutes}m left`);

    // Change task color based on urgency
    if (timeDiff < 3600000) {  // Less than 1 hour
        element.parent().addClass("warning").removeClass("ok");
    } else {
        element.parent().addClass("ok").removeClass("warning");
    }
}
