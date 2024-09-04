document.addEventListener('DOMContentLoaded', () => {
    // Elements for Coin Counter
    const coinCounter = document.getElementById('coin-counter');
    const spawnRateDisplay = document.getElementById('spawn-rate');
    const platformCapacityDisplay = document.getElementById('platform-capacity');
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

    // Constants and Initial Values
    const maxCoins = 100; // Max capacity of the coin platform
    let coinCount = 0; // Total coins collected
    let spawnRate = 1; // Base spawn rate (coins per second)
    let spawnInterval = 1000 / spawnRate; // Interval time in milliseconds
    let upgradeLevel = 0; // Level of the spawn rate upgrade
    let coinMultiplier = 1; // Initial coin multiplier
    const maxUpgradeLevel = 9; // Maximum upgrade levels
    const baseUpgradeCost = 1e9; // Base cost of the upgrade

    // Platform Capacity
    let currentPlatformCapacity = 100; // Initial platform capacity

    // Track list
    const tracks = [
        'DEAF KEV - Invincible  Glitch Hop  NCS - Copyright Free Music.mp3',
        'Different Heaven & EH!DE - My Heart  Drumstep  NCS - Copyright Free Music.mp3',
        'Elektronomia - Sky High  Progressive House  NCS - Copyright Free Music.mp3',
        'Disfigure - Blank  Melodic Dubstep  NCS - Copyright Free Music.mp3',
        'Different Heaven - Nekozilla  Electro  NCS - Copyright Free Music.mp3',
        'Jim Yosef - Firefly  Progressive House  NCS - Copyright Free Music.mp3',
        'Desmeon - Hellcat  Drumstep  NCS - Copyright Free Music.mp3',
        'JPB - High  Trap  NCS - Copyright Free Music.mp3',
        'K-391 - Earth  Drumstep  NCS - Copyright Free Music.mp3',
        'Jim Yosef & Anna Yvette - Linked  House  NCS - Copyright Free Music.mp3',
        'LFZ - Popsicle  House  NCS - Copyright Free Music.mp3',
        'Jim Yosef - Eclipse  House  NCS - Copyright Free Music.mp3',
        'Electro-Light - Symbolism  Trap  NCS - Copyright Free Music.mp3',
        'Cartoon, Jéja - On & On (feat. Daniel Levi)  Electronic Pop  NCS - Copyright Free Music.mp3',
        'Julius Dreisig & Zeus X Crona - Invisible  Trap  NCS - Copyright Free Music.mp3',
        'Killercats - Tell Me (feat. Alex Skrindo)  Future Bass  NCS - Copyright Free Music.mp3',
        'Distrion & Alex Skrindo - Entropy  House  NCS - Copyright Free Music.mp3',
        'Distrion & Electro-Light - Rubik  House  NCS - Copyright Free Music.mp3',
        'Lensko - Lets Go!  House  NCS - Copyright Free Music.mp3',
        'Kovan & Electro-Light - Skyline  House  NCS - Copyright Free Music.mp3'
    ];

    let shuffledTracks = [...tracks]; // Create a copy of the tracks array
    let currentTrackIndex = 0;
    let spawnIntervalId;

    function formatNumber(number) {
        if (number < 1e3) return number.toString(); // Less than 1000, no suffix needed
        if (number >= 1e3 && number < 1e6) return number.toLocaleString(); // Between 1000 and 1e6, use commas

        const suffixes = [
            { value: 1e303, suffix: 'Ce' },
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
            { value: 1e30, suffix: 'No' },
            { value: 1e27, suffix: 'Oc' },
            { value: 1e24, suffix: 'Sp' },
            { value: 1e21, suffix: 'Sx' },
            { value: 1e18, suffix: 'Qn' },
            { value: 1e15, suffix: 'Qd' },
            { value: 1e12, suffix: 'T' },
            { value: 1e9, suffix: 'B' },
            { value: 1e6, suffix: 'M' },
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

     function updatePlatformCapacity() {
        const coinCountOnPlatform = coinPlatform.children.length;
        platformCapacityDisplay.textContent = `Platform Capacity: ${coinCountOnPlatform}/${currentPlatformCapacity}`;

        // Change text color and boldness based on platform capacity
        if (coinCountOnPlatform >= currentPlatformCapacity) {
            platformCapacityDisplay.style.color = 'red';
            platformCapacityDisplay.style.fontWeight = 'bold';
        } else {
            platformCapacityDisplay.style.color = 'black';
            platformCapacityDisplay.style.fontWeight = 'normal';
        }
    }

    function updateSpawnRate() {
    clearInterval(spawnIntervalId); // Clear the existing interval
    // Calculate the spawn interval, ensuring it doesn't go below 0.1s
    spawnInterval = Math.max(100, 1000 - (upgradeLevel * 100)); 

    // Update the spawn rate display
    const displaySpawnInterval = (spawnInterval / 1000).toFixed(1);
    spawnRateDisplay.textContent = `Coin Spawn Rate: 1 per ${displaySpawnInterval}s`;

    // Start the new interval
    spawnIntervalId = setInterval(spawnCoin, spawnInterval);
}

    function spawnCoin() {
        if (coinPlatform.children.length >= currentPlatformCapacity) {
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
            updatePlatformCapacity(); // Update platform capacity display
        });

        coinPlatform.appendChild(coin);
        updatePlatformCapacity(); // Update platform capacity display
    }

    function handleUpgrade() {
        // Calculate the cost with scaling factor
        const upgradeCost = baseUpgradeCost * Math.pow(2, upgradeLevel); // Cost scales by 2x per level

        if (coinCount >= upgradeCost && upgradeLevel < maxUpgradeLevel) {
            coinCount -= upgradeCost;
            upgradeLevel++;
            updateSpawnRate();
            updateCoinCounter();
            spawnRateUpgradeButton.textContent = `Increase Coin Spawn Speed (Cost: ${formatNumber(baseUpgradeCost * Math.pow(2, upgradeLevel))} Coins)`;
        } else {
            alert("Not enough coins or maximum level reached.");
        }
    }

    function increaseCoinMultiplier() {
        if (coinCount >= 1e6) {
            coinCount -= 1e6;
            coinMultiplier *= 10; // Increase coin multiplier by 10x
            updateCoinCounter();
            coinMultiplierUpgradeButton.textContent = `Increase Coin Multi by 10x Compounding [for testing purposes] (x${coinMultiplier})`;
        } else {
            alert("Not enough coins to increase multiplier.");
        }
    }

    function increaseCoinsExponentially() {
        coinMultiplier *= 10; // Multiply coin gain by 10x
        updateCoinCounter();
        testButton.textContent = `Increase Coin Multi by 10x Compounding [for testing purposes] (x${coinMultiplier})`;
    }

    function toggleSettingsMenu() {
        if (settingsOverlay.style.display === 'none' || settingsOverlay.style.display === '') {
            settingsOverlay.style.display = 'flex'; // Show the settings menu
        } else {
            settingsOverlay.style.display = 'none'; // Hide the settings menu
        }
    }

    function changeTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % shuffledTracks.length;
        music.src = shuffledTracks[currentTrackIndex];
        music.play();
    }

    function toggleMusic() {
        if (musicCheckbox.checked) {
            music.play();
        } else {
            music.pause();
        }
    }

    // Event Listeners
    spawnRateUpgradeButton.addEventListener('click', handleUpgrade);
    coinMultiplierUpgradeButton.addEventListener('click', increaseCoinMultiplier);
    testButton.addEventListener('click', increaseCoinsExponentially);
    settingsButton.addEventListener('click', toggleSettingsMenu);
    closeSettingsButton.addEventListener('click', toggleSettingsMenu);
    changeTrackButton.addEventListener('click', changeTrack);
    musicCheckbox.addEventListener('change', toggleMusic);

    // Initialize
    updateCoinCounter();
    updateSpawnRate();
    updatePlatformCapacity(); // Initialize platform capacity display

    // Preload music and start playback
    music.src = shuffledTracks[currentTrackIndex];
    music.addEventListener('ended', changeTrack);
});
