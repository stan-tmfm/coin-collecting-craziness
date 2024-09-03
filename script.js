document.addEventListener('DOMContentLoaded', () => {
    const coinCounter = document.getElementById('coin-counter');
    const spawnRateDisplay = document.getElementById('spawn-rate');
    const spawnRateUpgradeButton = document.getElementById('spawn-rate-upgrade');
    const coinMultiplierUpgradeButton = document.getElementById('coin-multiplier-upgrade');
    const coinPlatform = document.getElementById('coin-platform');
    const testButton = document.getElementById('test-button');
    const settingsButton = document.getElementById('settings-button');
    const settingsOverlay = document.getElementById('settings-overlay');
    const closeSettingsButton = document.getElementById('close-settings');
    const changeTrackButton = document.getElementById('change-track-button');
    const music = document.getElementById('background-music');
    const musicCheckbox = document.getElementById('music-checkbox');

    const maxCoins = 100; // Max capacity of the coin platform
    let coinCount = 0; // Total coins collected
    let spawnRate = 1; // Base spawn rate (coins per second)
    let spawnInterval = 1000 / spawnRate; // Interval time in milliseconds
    let upgradeLevel = 0; // Level of the spawn rate upgrade
    let coinMultiplier = 1; // Initial coin multiplier
    const maxUpgradeLevel = 9; // Maximum upgrade levels
    const baseUpgradeCost = 1e9; // Base cost of the upgrade

    // Track list
    const tracks = [
        'DEAF KEV - Invincible  Glitch Hop  NCS - Copyright Free Music.mp3',
        'Different Heaven & EH!DE - My Heart  Drumstep  NCS - Copyright Free Music.mp3',
        'Elektronomia - Sky High  Progressive House  NCS - Copyright Free Music.mp3'
    ];

    let currentTrackIndex = 0;
    let spawnIntervalId;

    function formatNumber(number) {
        if (number < 1e3) return number.toString(); // Less than 1000, no suffix needed
        if (number >= 1e3 && number < 1e6) return number.toLocaleString(); // Between 1000 and 1e6, use commas

        const suffixes = [
            { value: 1e303, suffix: 'NoNg' },
            { value: 1e300, suffix: 'NoNg' },
            { value: 1e270, suffix: 'Ng' },
            { value: 1e243, suffix: 'Og' },
            { value: 1e213, suffix: 'Sg' },
            { value: 1e183, suffix: 'sg' },
            { value: 1e153, suffix: 'Qg' },
            { value: 1e123, suffix: 'qg' },
            { value: 1e93, suffix: 'Tg' },
            { value: 1e63, suffix: 'Vt' },
            { value: 1e33, suffix: 'De' },
            { value: 1e27, suffix: 'Oc' },
            { value: 1e24, suffix: 'Sp' },
            { value: 1e21, suffix: 'Sx' },
            { value: 1e18, suffix: 'Qn' },
            { value: 1e15, suffix: 'Qd' },
            { value: 1e12, suffix: 'T' },
            { value: 1e9, suffix: 'B' },
            { value: 1e6, suffix: 'M' },
            { value: 1e3, suffix: 'k' }
        ];

        for (const { value, suffix } of suffixes) {
            if (number >= value) {
                return (number / value).toFixed(2).replace(/\.00$/, '') + suffix;
            }
        }
    }

    function updateCoinCounter() {
        coinCounter.textContent = `Coins: ${formatNumber(coinCount)}`;
    }

    function updateSpawnRate() {
        clearInterval(spawnIntervalId); // Clear the existing interval
        spawnInterval = Math.max(100, 1000 / (spawnRate + upgradeLevel * 0.1)); // Adjust spawn interval based on upgrade level

        const coinsPerSecond = (1000 / spawnInterval).toFixed(1);
        spawnRateDisplay.textContent = `Coin Spawn Rate: 1 per ${coinsPerSecond}s`;
        console.log(`Updated spawnInterval to: ${spawnInterval}`);

        // Start the new interval
        spawnIntervalId = setInterval(spawnCoin, spawnInterval);
    }

    function spawnCoin() {
        if (coinPlatform.children.length >= maxCoins) {
            console.log('Coin platform is full.');
            return; // Stop spawning if platform is full
        }

        const coin = document.createElement('div');
        coin.classList.add('coin');

        // Random position within the platform
        const x = Math.random() * (coinPlatform.clientWidth - 30);
        const y = Math.random() * (coinPlatform.clientHeight - 30);
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;

        // Handle coin hover event
        coin.addEventListener('mouseover', () => {
            coin.remove();
            coinCount += coinMultiplier; // Apply multiplier to coin gain
            updateCoinCounter();
        });

        coinPlatform.appendChild(coin);
        console.log('Coin spawned at:', x, y);
    }

    function handleUpgrade() {
        // Calculate the cost with scaling factor
        const upgradeCost = baseUpgradeCost * Math.pow(2, upgradeLevel); // Cost scales by 2x per level

        if (coinCount >= upgradeCost && upgradeLevel < maxUpgradeLevel) {
            coinCount -= upgradeCost;
            upgradeLevel++;
            updateSpawnRate();
            updateCoinCounter();
            spawnRateUpgradeButton.textContent = `Reduce Spawn Rate (Cost: ${formatNumber(baseUpgradeCost * Math.pow(2, upgradeLevel))})`;
        } else {
            alert("Not enough coins or maximum level reached.");
        }
    }

    function increaseCoinMultiplier() {
        coinMultiplier *= 10; // Increase coin multiplier by 10x
        updateCoinCounter();
        coinMultiplierUpgradeButton.textContent = `Increase Coin Gain (x10) [Current Multiplier: ${coinMultiplier}] [Testing]`;
    }

    function toggleSettingsMenu() {
        if (settingsOverlay.style.display === 'none' || settingsOverlay.style.display === '') {
            settingsOverlay.style.display = 'flex'; // Show the settings menu
        } else {
            settingsOverlay.style.display = 'none'; // Hide the settings menu
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    // Shuffle the tracks array
    shuffleArray(tracks);

    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        music.src = tracks[currentTrackIndex];
        music.play().catch((error) => {
            console.error('Error playing audio:', error);
        });
    }

    function startMusic() {
        if (musicCheckbox.checked) {
            music.src = tracks[currentTrackIndex];
            music.play().catch((error) => {
                console.error('Error playing audio:', error);
            });
        }
    }

    function updateMusicPlayback() {
        if (musicCheckbox.checked) {
            startMusic();
        } else {
            music.pause();
            music.src = ''; // Reset source to stop playback completely
        }
    }

    function changeTrack() {
        playNextTrack();
    }

    // Initialize music playback
    updateMusicPlayback();

    // Event listeners
    musicCheckbox.addEventListener('change', updateMusicPlayback);
    changeTrackButton.addEventListener('click', changeTrack);

    // Initial setup
    updateSpawnRate();
    updateCoinCounter();
    spawnRateUpgradeButton.addEventListener('click', handleUpgrade);
    coinMultiplierUpgradeButton.addEventListener('click', increaseCoinMultiplier);

    // Testing button functionality
    testButton.addEventListener('click', () => {
        coinMultiplier *= 10;
        updateCoinCounter();
    });

    // Settings menu functionality
    settingsButton.addEventListener('click', toggleSettingsMenu);
    closeSettingsButton.addEventListener('click', () => {
        settingsOverlay.style.display = 'none'; // Hide the settings menu
    });
});
