$(document).ready(function () {
  // ---------------------------------------------------------
  // API DATA
  // ---------------------------------------------------------

  const apiUrl = "https://api.restful-api.dev/objects";

  const $apiStatus = $("#apiStatus");
  const $apiDataContainer = $("#apiDataContainer");

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderApiData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      $apiDataContainer.html(
        '<div class="col-12"><p class="text-light">No data available.</p></div>'
      );
      return;
    }

    const items = data.slice(0, 6);

    const html = items
      .map(function (item) {
        const itemName = escapeHtml(item.name || "Unnamed Item");

        let details = "";

        if (item.data && typeof item.data === "object") {
          details = Object.entries(item.data)
            .slice(0, 3)
            .map(function ([key, value]) {
              return `
                <div class="api-detail">
                  <span>${escapeHtml(key)}</span>
                  <strong>${escapeHtml(value)}</strong>
                </div>
              `;
            })
            .join("");
        }

        return `
          <div class="col-md-6 col-lg-4">
            <div class="api-card">
              <div class="api-card-number">
                ${escapeHtml(item.id || "")}
              </div>

              <h5>${itemName}</h5>

              <div class="api-details">
                ${details}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    $apiDataContainer.html(html);
  }

  $.ajax({
    url: apiUrl,
    method: "GET",
    dataType: "json",

    success: function (data) {
      $apiStatus.html(
        '<span class="status-dot"></span>' +
          data.length +
          " records loaded"
      );

      renderApiData(data);
    },

    error: function () {
      $apiStatus.html(
        '<span class="status-dot error"></span> Unable to load data'
      );

      $apiDataContainer.html(`
        <div class="col-12">
          <div class="api-error">
            Unable to load live API data. Please try again later.
          </div>
        </div>
      `);
    }
  });

  // ---------------------------------------------------------
  // IMAGE UPLOAD
  // ---------------------------------------------------------

  const $dropZone = $("#dropZone");
  const $imageInput = $("#imageInput");
  const $browseButton = $("#browseButton");

  const $uploadContent = $("#uploadContent");
  const $previewArea = $("#previewArea");

  const $imagePreview = $("#imagePreview");
  const $fileName = $("#fileName");
  const $fileSize = $("#fileSize");

  const $uploadButton = $("#uploadButton");
  const $removeButton = $("#removeButton");
  const $uploadMessage = $("#uploadMessage");

  let selectedFile = null;

  // ---------------------------------------------------------
  // FILE SIZE
  // ---------------------------------------------------------

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  // ---------------------------------------------------------
  // SHOW SELECTED IMAGE
  // ---------------------------------------------------------

  function showSelectedFile(file) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      $uploadMessage
        .removeClass("success")
        .addClass("error")
        .text("Please select an image file.");

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      $uploadMessage
        .removeClass("success")
        .addClass("error")
        .text("Image size must be 5 MB or less.");

      return;
    }

    selectedFile = file;

    const reader = new FileReader();

    reader.onload = function (event) {
      $imagePreview.attr("src", event.target.result);

      $fileName.text(file.name);
      $fileSize.text(formatFileSize(file.size));

      $uploadContent.addClass("d-none");
      $previewArea.removeClass("d-none");

      // Show Upload button whenever a new image is selected
      $uploadButton.removeClass("d-none");

      // Clear previous message
      $uploadMessage
        .removeClass("success error")
        .text("");
    };

    reader.readAsDataURL(file);
  }

  // ---------------------------------------------------------
  // BROWSE BUTTON
  // ---------------------------------------------------------

  $browseButton.on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    document.getElementById("imageInput").click();
  });

  // ---------------------------------------------------------
  // FILE INPUT
  // ---------------------------------------------------------

  $imageInput.on("change", function () {
    const file = this.files && this.files[0];

    if (file) {
      showSelectedFile(file);
    }
  });

  // ---------------------------------------------------------
  // DROP ZONE CLICK
  // ---------------------------------------------------------

  $dropZone.on("click", function (event) {
    // Don't trigger file picker when clicking buttons
    if (
      $(event.target).is("button") ||
      $(event.target).closest("button").length
    ) {
      return;
    }

    document.getElementById("imageInput").click();
  });

  // ---------------------------------------------------------
  // DRAG OVER
  // ---------------------------------------------------------

  $dropZone.on("dragover", function (event) {
    event.preventDefault();
    event.stopPropagation();

    $dropZone.addClass("drag-over");
  });

  // ---------------------------------------------------------
  // DRAG LEAVE
  // ---------------------------------------------------------

  $dropZone.on("dragleave", function (event) {
    event.preventDefault();
    event.stopPropagation();

    $dropZone.removeClass("drag-over");
  });

  // ---------------------------------------------------------
  // DROP FILE
  // ---------------------------------------------------------

  $dropZone.on("drop", function (event) {
    event.preventDefault();
    event.stopPropagation();

    $dropZone.removeClass("drag-over");

    const files = event.originalEvent.dataTransfer.files;

    if (files && files.length > 0) {
      showSelectedFile(files[0]);
    }
  });

  // ---------------------------------------------------------
  // UPLOAD IMAGE
  // ---------------------------------------------------------

  $uploadButton.on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedFile) {
      $uploadMessage
        .removeClass("success")
        .addClass("error")
        .text("Please select an image first.");

      return;
    }

    const formData = new FormData();

    formData.append("image", selectedFile);

    $uploadButton.prop("disabled", true).text("Uploading...");

    $.ajax({
      url: "/api/upload",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,

      success: function (response) {
        // Show success message
        $uploadMessage
          .removeClass("error")
          .addClass("success")
          .text(
            "✓ " +
              response.message +
              " File: " +
              response.filename
          );

        // Hide Upload button after successful upload
        $uploadButton.addClass("d-none");

        // Keep Remove button visible
        $removeButton.removeClass("d-none");

        // Reset disabled state
        $uploadButton.prop("disabled", false).text("Upload Image");
      },

      error: function (xhr) {
        let message = "Image upload failed.";

        if (
          xhr.responseJSON &&
          xhr.responseJSON.message
        ) {
          message = xhr.responseJSON.message;
        }

        $uploadMessage
          .removeClass("success")
          .addClass("error")
          .text(message);

        $uploadButton
          .prop("disabled", false)
          .text("Upload Image");
      }
    });
  });

  // ---------------------------------------------------------
  // REMOVE / RESET IMAGE
  // ---------------------------------------------------------

  $removeButton.on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Clear selected file
    selectedFile = null;

    // Clear browser file input
    $imageInput.val("");

    // Clear preview
    $imagePreview.attr("src", "");
    $fileName.text("");
    $fileSize.text("");

    // Reset upload UI
    $uploadContent.removeClass("d-none");
    $previewArea.addClass("d-none");

    // Show Upload button again for the next image
    $uploadButton
      .removeClass("d-none")
      .prop("disabled", false)
      .text("Upload Image");

    // Clear success/error message
    $uploadMessage
      .removeClass("success error")
      .text("");
  });

  // ---------------------------------------------------------
  // SCROLL REVEAL ANIMATION
  // ---------------------------------------------------------

  function revealOnScroll() {
    $(".reveal").each(function () {
      const elementTop = $(this).offset().top;
      const windowBottom =
        $(window).scrollTop() + $(window).height();

      if (elementTop < windowBottom - 80) {
        $(this).addClass("visible");
      }
    });
  }

  $(window).on("scroll", revealOnScroll);

  revealOnScroll();
});