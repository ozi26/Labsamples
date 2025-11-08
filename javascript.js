  <script>
        // DOM Elements
        const hoursInput = document.getElementById('hours');
        const minutesInput = document.getElementById('minutes');
        const secondsInput = document.getElementById('seconds');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const timerDisplay = document.getElementById('timer');
        const alertMsg = document.getElementById('alert');
        const alarmSound = document.getElementById('alarmSound');

        // State variables
        let countdown;
        let totalSeconds = 0;
        let remainingSeconds = 0;
        let isRunning = false;
        let isPaused = false;

        // Format time as HH:MM:SS
        function formatTime(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }

        // Update display
        function updateDisplay() {
            timerDisplay.textContent = formatTime(remainingSeconds);
        }

        // Start the countdown
        function startTimer() {
            if (isRunning) return;

            // Get input values
            const h = parseInt(hoursInput.value) || 0;
            const m = parseInt(minutesInput.value) || 0;
            const s = parseInt(secondsInput.value) || 0;

            totalSeconds = h * 3600 + m * 60 + s;

            if (totalSeconds <= 0) {
                showAlert('Please enter a valid time!');
                return;
            }

            if (isPaused) {
                // Resume from paused state
                isPaused = false;
            } else {
                // Start fresh
                remainingSeconds = totalSeconds;
            }

            isRunning = true;
            updateDisplay();
            toggleButtons();

            countdown = setInterval(() => {
                if (remainingSeconds > 0) {
                    remainingSeconds--;
                    updateDisplay();
                } else {
                    clearInterval(countdown);
                    isRunning = false;
                    toggleButtons();
                    triggerAlarm();
                }
            }, 1000);
        }

        // Pause the timer
        function pauseTimer() {
            if (!isRunning || isPaused) return;

            clearInterval(countdown);
            isPaused = true;
            isRunning = false;
            toggleButtons();
        }

        // Reset the timer
        function resetTimer() {
            clearInterval(countdown);
            isRunning = false;
            isPaused = false;
            remainingSeconds = 0;
            updateDisplay();
            toggleButtons();
            hideAlert();
            alarmSound.pause();
            alarmSound.currentTime = 0;
        }

        // Toggle button states
        function toggleButtons() {
            startBtn.disabled = isRunning && !isPaused;
            startBtn.textContent = isPaused ? 'Resume' : 'Start Timer';
            pauseBtn.disabled = !isRunning || isPaused;
            resetBtn.disabled = !isRunning && !isPaused && remainingSeconds === 0;
        }

        // Trigger alarm sound and alert
        function triggerAlarm() {
            showAlert("Time's up!");
            alarmSound.play().catch(e => {
                console.log("Audio play failed:", e);
                // Fallback: try to play after user interaction if blocked
            });
            
            // Visual flash effect
            document.body.style.background = '#ff6b6b';
            setTimeout(() => {
                document.body.style.background = 'linear-gradient(135deg, #1e3c72, #2a5298)';
            }, 500);
        }

        // Show alert message
        function showAlert(message) {
            alertMsg.textContent = message;
            alertMsg.classList.add('show');
            setTimeout(() => {
                alertMsg.classList.remove('show');
            }, 3000);
        }

        // Hide alert
        function hideAlert() {
            alertMsg.classList.remove('show');
        }

        // Event Listeners
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);

        // Input validation
        [hoursInput, minutesInput, secondsInput].forEach(input => {
            input.addEventListener('input', function() {
                const value = parseInt(this.value);
                const max = this.id === 'hours' ? 23 : 59;
                
                if (isNaN(value)) {
                    this.value = 0;
                } else if (value > max) {
                    this.value = max;
                } else if (value < 0) {
                    this.value = 0;
                }
            });
        });

        </script> Initialize display 
        updateDisplay();
        toggleButtons();