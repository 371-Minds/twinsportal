// Function to handle tab switching
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Get all elements with class="tab-content" and hide them
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tab-link" and remove the class "active"
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Placeholder functions for submission handling (to be implemented later)
function handleTextMessageSubmit() {
    console.log("Text message submitted (placeholder)");
    // TODO: Implement actual text submission logic
}

function setupDrawingCanvas() {
    console.log("Drawing canvas setup (placeholder)");
        const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('color-picker');
    const pencilTool = document.getElementById('pencil-tool');
    const brushTool = document.getElementById('brush-tool');
    const eraserTool = document.getElementById('eraser-tool');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const saveBtn = document.getElementById('save-drawing-btn');
    const discardBtn = document.getElementById('discard-drawing-btn');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'pencil'; // Default tool
    let history = [canvas.toDataURL()]; // Store initial state for undo/redo
    let historyIndex = 0;

    // Set initial context properties
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2; // Default pencil size
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    function draw(e) {
        if (!isDrawing) return; // Stop the function if not drawing
        
        ctx.strokeStyle = colorPicker.value;
        // Adjust line width based on tool
        if (currentTool === 'brush') {
            ctx.lineWidth = 10;
        } else if (currentTool === 'pencil') {
            ctx.lineWidth = 2;
        } else if (currentTool === 'eraser') {
            ctx.strokeStyle = '#FFFFFF'; // Eraser is just drawing white
            ctx.lineWidth = 20; 
        }

        ctx.beginPath();
        // Start from
        ctx.moveTo(lastX, lastY);
        // Go to
        const { offsetX, offsetY } = getMousePos(canvas, e);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        // Update last coordinates
        [lastX, lastY] = [offsetX, offsetY];
    }

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    function startDrawing(e) {
        isDrawing = true;
        const { offsetX, offsetY } = getMousePos(canvas, e);
        [lastX, lastY] = [offsetX, offsetY];
    }

    function stopDrawing() {
        if (!isDrawing) return;
        isDrawing = false;
        // Save state for undo/redo
        saveCanvasState();
    }
    
    function saveCanvasState() {
        // Clear redo history beyond current state
        history = history.slice(0, historyIndex + 1);
        history.push(canvas.toDataURL());
        historyIndex++;
        // Disable redo button if at the latest state
        redoBtn.disabled = true; 
        // Enable undo button
        undoBtn.disabled = false;
    }

    function undoLast() {
        if (historyIndex > 0) {
            historyIndex--;
            const previousState = new Image();
            previousState.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
                ctx.drawImage(previousState, 0, 0); // Draw previous state
            };
            previousState.src = history[historyIndex];
            redoBtn.disabled = false; // Enable redo
            if (historyIndex === 0) {
                undoBtn.disabled = true; // Disable undo if at the beginning
            }
        }
    }

    function redoNext() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            const nextState = new Image();
            nextState.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(nextState, 0, 0);
            };
            nextState.src = history[historyIndex];
            undoBtn.disabled = false; // Enable undo
            if (historyIndex === history.length - 1) {
                redoBtn.disabled = true; // Disable redo if at the end
            }
        }
    }

    // Event Listeners for Drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing); // Stop drawing if mouse leaves canvas

    // Event Listeners for Tools
    pencilTool.addEventListener('click', () => currentTool = 'pencil');
    brushTool.addEventListener('click', () => currentTool = 'brush');
    eraserTool.addEventListener('click', () => currentTool = 'eraser');
    undoBtn.addEventListener('click', undoLast);
    redoBtn.addEventListener('click', redoNext);
    
    // Initial state for buttons
    undoBtn.disabled = true;
    redoBtn.disabled = true;

    // TODO: Add listeners for save/discard buttons and implement their logic
}

function handleDrawingSubmit() {
    console.log("Drawing submitted (placeholder)");
        // Get the drawing as a data URL (e.g., PNG)
    const drawingDataUrl = canvas.toDataURL('image/png');
    console.log("Drawing submitted (placeholder):", drawingDataUrl.substring(0, 50) + "...");
    // TODO: Send drawingDataUrl to the server or handle as needed
    // TODO: Clear canvas after submission or provide feedback
    // Reset history after saving
    history = [canvas.toDataURL()]; 
    historyIndex = 0;
    undoBtn.disabled = true;
    redoBtn.disabled = true;
}

function setupVoiceRecorder() {
    console.log("Voice recorder setup (placeholder)");
        const recordBtn = document.getElementById('record-btn');
    const stopBtn = document.getElementById('stop-btn');
    const audioPlayer = document.getElementById('audio-player');
    const audioPlaybackDiv = document.getElementById('audio-playback');
    const submitVoiceBtn = document.getElementById('submit-voice-btn');
    const discardVoiceBtn = document.getElementById('discard-voice-btn');
    const waveformContainer = document.getElementById('waveform-container'); // Placeholder for visualization

    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;
    let recordingTimer;

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/wav' }); // Or mp3 if preferred and supported
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayer.src = audioUrl;
                audioPlaybackDiv.style.display = 'block';
                recordBtn.disabled = false;
                stopBtn.disabled = true;
                audioChunks = []; // Reset chunks for next recording
                clearTimeout(recordingTimer); // Clear the timer
                // TODO: Implement waveform visualization stop
                waveformContainer.innerHTML = '<p>(Recording finished. Playback ready.)</p>'; 
            };

            mediaRecorder.start();
            recordBtn.disabled = true;
            stopBtn.disabled = false;
            audioPlaybackDiv.style.display = 'none'; // Hide playback while recording
            // TODO: Implement waveform visualization start
            waveformContainer.innerHTML = '<p>(Recording...)</p>'; 

            // Stop recording after 30 seconds
            recordingTimer = setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    stopRecording();
                }
            }, 30000); 

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure permission is granted.");
            recordBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    }

    function discardRecording() {
        audioPlayer.src = '';
        audioBlob = null;
        audioPlaybackDiv.style.display = 'none';
        waveformContainer.innerHTML = '<p>(Waveform placeholder)</p>'; 
        console.log("Voice recording discarded.");
    }

    // Event Listeners for Voice Recording
    recordBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    submitVoiceBtn.addEventListener('click', handleVoiceSubmit); // Use existing placeholder
    discardVoiceBtn.addEventListener('click', discardRecording);
}

function handleVoiceSubmit() {
    console.log("Voice message submitted (placeholder)");
        if (!audioBlob) {
        alert("No recording available to submit.");
        return;
    }
    console.log("Voice message submitted (placeholder):", audioBlob);
    // TODO: Implement actual voice submission (e.g., upload audioBlob to server)
    // Clear the recording after submission
    discardRecording();
}

// Function to setup Download Zone interactions
function setupDownloadZone() {
    // Get modal elements
    const modal = document.getElementById("preview-modal");
    const modalImg = document.getElementById("preview-image");
    const captionText = document.getElementById("caption");
    const span = document.getElementsByClassName("close-btn")[0];
    console.log("Download Zone setup");
    const categoryBtns = document.querySelectorAll('.category-btn');
    const galleryItems = document.querySelectorAll('.download-card');
    const downloadBtns = document.querySelectorAll('.download-btn');
    const previewBtns = document.querySelectorAll('.preview-btn');

    // Check if elements exist before adding listeners
    if (!categoryBtns.length || !galleryItems.length || !modal || !modalImg || !captionText || !span) {
        console.warn("Download zone elements not found. Skipping setup.");
        return;
    }

    // Category Filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button style
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            filterGallery(category);
        });
    });

    // Preview Button Logic
    previewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.download-card');
            const previewImage = card.querySelector('.download-preview');
            const title = card.querySelector('h3');

            if (previewImage && title) {
                modal.style.display = "block";
                modalImg.src = previewImage.src;
                captionText.innerHTML = title.innerHTML;
            } else {
                console.error("Could not find preview image or title for this card.");
            }
        });
    });

    // Modal Close Logic
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal content, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function filterGallery(category) {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block'; // Or your preferred display style
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Preview Functionality (Placeholder)
    previewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.download-card');
            if (!card) return;
            const previewElement = card.querySelector('.download-preview');
            const imgSrc = previewElement ? previewElement.src : 'No image found';
            // TODO: Implement actual preview modal/overlay
            alert(`Previewing: ${imgSrc}`);
            console.log("Preview button clicked for:", card);
        });
    });

    // Download Functionality & Tracking (Placeholder)
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.download-card');
            if (!card) return;
            const fileToDownload = btn.getAttribute('data-file');
            const headingElement = card.querySelector('h3');
            const itemName = headingElement ? headingElement.textContent : 'Unknown Item';

            if (!fileToDownload) {
                console.error("No download file specified for this button.");
                alert("Sorry, the download link is missing.");
                return;
            }

            // TODO: Implement actual file download logic
            console.log(`Attempting to download: ${itemName} from ${fileToDownload}`);
            alert(`Downloading: ${itemName}`);

            // TODO: Implement download tracking
            trackDownload(itemName, fileToDownload);

            // Simulate download (remove this in final implementation)
            // window.location.href = fileToDownload; 
        });
    });

    function trackDownload(itemName, filePath) {
        console.log(`Tracking download for: ${itemName} (${filePath})`);
        // TODO: Increment local counter (if needed)
        // TODO: Send data to n8n workflow endpoint
        // Example using fetch API (replace with actual endpoint and data structure):
        /*
        fetch('YOUR_N8N_WEBHOOK_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                item: itemName,
                file: filePath,
                timestamp: new Date().toISOString()
            }),
        })
        .then(response => response.json())
        .then(data => console.log('n8n tracking success:', data))
        .catch((error) => console.error('n8n tracking error:', error));
        */
    }

    // Initial filter display (show all)
    filterGallery('all');
}

// Initial setup calls
document.addEventListener('DOMContentLoaded', (event) => {
    // Call setup functions when the page loads
    if (document.getElementById('drawing-canvas')) {
        setupDrawingCanvas();
    }
    if (document.getElementById('record-btn')) {
        setupVoiceRecorder();
    }
    if (document.getElementById('download-zone')) {
        setupDownloadZone(); // Initialize download zone interactions
    }
    // Ensure the first tab is displayed correctly on load
    // (The HTML already sets the first tab to display: block)
});