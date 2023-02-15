/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./ow-game-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games-events */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-hotkeys */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-window */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js"), exports);


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGameListener = void 0;
const ow_listener_1 = __webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js");
class OWGameListener extends ow_listener_1.OWListener {
    constructor(delegate) {
        super(delegate);
        this.onGameInfoUpdated = (update) => {
            if (!update || !update.gameInfo) {
                return;
            }
            if (!update.runningChanged && !update.gameChanged) {
                return;
            }
            if (update.gameInfo.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(update.gameInfo);
                }
            }
            else {
                if (this._delegate.onGameEnded) {
                    this._delegate.onGameEnded(update.gameInfo);
                }
            }
        };
        this.onRunningGameInfo = (info) => {
            if (!info) {
                return;
            }
            if (info.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(info);
                }
            }
        };
    }
    start() {
        super.start();
        overwolf.games.onGameInfoUpdated.addListener(this.onGameInfoUpdated);
        overwolf.games.getRunningGameInfo(this.onRunningGameInfo);
    }
    stop() {
        overwolf.games.onGameInfoUpdated.removeListener(this.onGameInfoUpdated);
    }
}
exports.OWGameListener = OWGameListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js":
/*!************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGamesEvents = void 0;
const timer_1 = __webpack_require__(/*! ./timer */ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js");
class OWGamesEvents {
    constructor(delegate, requiredFeatures, featureRetries = 10) {
        this.onInfoUpdates = (info) => {
            this._delegate.onInfoUpdates(info.info);
        };
        this.onNewEvents = (e) => {
            this._delegate.onNewEvents(e);
        };
        this._delegate = delegate;
        this._requiredFeatures = requiredFeatures;
        this._featureRetries = featureRetries;
    }
    async getInfo() {
        return new Promise((resolve) => {
            overwolf.games.events.getInfo(resolve);
        });
    }
    async setRequiredFeatures() {
        let tries = 1, result;
        while (tries <= this._featureRetries) {
            result = await new Promise(resolve => {
                overwolf.games.events.setRequiredFeatures(this._requiredFeatures, resolve);
            });
            if (result.status === 'success') {
                console.log('setRequiredFeatures(): success: ' + JSON.stringify(result, null, 2));
                return (result.supportedFeatures.length > 0);
            }
            await timer_1.Timer.wait(3000);
            tries++;
        }
        console.warn('setRequiredFeatures(): failure after ' + tries + ' tries' + JSON.stringify(result, null, 2));
        return false;
    }
    registerEvents() {
        this.unRegisterEvents();
        overwolf.games.events.onInfoUpdates2.addListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.addListener(this.onNewEvents);
    }
    unRegisterEvents() {
        overwolf.games.events.onInfoUpdates2.removeListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.removeListener(this.onNewEvents);
    }
    async start() {
        console.log(`[ow-game-events] START`);
        this.registerEvents();
        await this.setRequiredFeatures();
        const { res, status } = await this.getInfo();
        if (res && status === 'success') {
            this.onInfoUpdates({ info: res });
        }
    }
    stop() {
        console.log(`[ow-game-events] STOP`);
        this.unRegisterEvents();
    }
}
exports.OWGamesEvents = OWGamesEvents;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGames = void 0;
class OWGames {
    static getRunningGameInfo() {
        return new Promise((resolve) => {
            overwolf.games.getRunningGameInfo(resolve);
        });
    }
    static classIdFromGameId(gameId) {
        let classId = Math.floor(gameId / 10);
        return classId;
    }
    static async getRecentlyPlayedGames(limit = 3) {
        return new Promise((resolve) => {
            if (!overwolf.games.getRecentlyPlayedGames) {
                return resolve(null);
            }
            overwolf.games.getRecentlyPlayedGames(limit, result => {
                resolve(result.games);
            });
        });
    }
    static async getGameDBInfo(gameClassId) {
        return new Promise((resolve) => {
            overwolf.games.getGameDBInfo(gameClassId, resolve);
        });
    }
}
exports.OWGames = OWGames;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWHotkeys = void 0;
class OWHotkeys {
    constructor() { }
    static getHotkeyText(hotkeyId, gameId) {
        return new Promise(resolve => {
            overwolf.settings.hotkeys.get(result => {
                if (result && result.success) {
                    let hotkey;
                    if (gameId === undefined)
                        hotkey = result.globals.find(h => h.name === hotkeyId);
                    else if (result.games && result.games[gameId])
                        hotkey = result.games[gameId].find(h => h.name === hotkeyId);
                    if (hotkey)
                        return resolve(hotkey.binding);
                }
                resolve('UNASSIGNED');
            });
        });
    }
    static onHotkeyDown(hotkeyId, action) {
        overwolf.settings.hotkeys.onPressed.addListener((result) => {
            if (result && result.name === hotkeyId)
                action(result);
        });
    }
}
exports.OWHotkeys = OWHotkeys;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js":
/*!********************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWListener = void 0;
class OWListener {
    constructor(delegate) {
        this._delegate = delegate;
    }
    start() {
        this.stop();
    }
}
exports.OWListener = OWListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js":
/*!******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWWindow = void 0;
class OWWindow {
    constructor(name = null) {
        this._name = name;
        this._id = null;
    }
    async restore() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.restore(id, result => {
                if (!result.success)
                    console.error(`[restore] - an error occurred, windowId=${id}, reason=${result.error}`);
                resolve();
            });
        });
    }
    async minimize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.minimize(id, () => { });
            return resolve();
        });
    }
    async maximize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.maximize(id, () => { });
            return resolve();
        });
    }
    async hide() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.hide(id, () => { });
            return resolve();
        });
    }
    async close() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            const result = await this.getWindowState();
            if (result.success &&
                (result.window_state !== 'closed')) {
                await this.internalClose();
            }
            return resolve();
        });
    }
    dragMove(elem) {
        elem.className = elem.className + ' draggable';
        elem.onmousedown = e => {
            e.preventDefault();
            overwolf.windows.dragMove(this._name);
        };
    }
    async getWindowState() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.getWindowState(id, resolve);
        });
    }
    static async getCurrentInfo() {
        return new Promise(async (resolve) => {
            overwolf.windows.getCurrentWindow(result => {
                resolve(result.window);
            });
        });
    }
    obtain() {
        return new Promise((resolve, reject) => {
            const cb = res => {
                if (res && res.status === "success" && res.window && res.window.id) {
                    this._id = res.window.id;
                    if (!this._name) {
                        this._name = res.window.name;
                    }
                    resolve(res.window);
                }
                else {
                    this._id = null;
                    reject();
                }
            };
            if (!this._name) {
                overwolf.windows.getCurrentWindow(cb);
            }
            else {
                overwolf.windows.obtainDeclaredWindow(this._name, cb);
            }
        });
    }
    async assureObtained() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.obtain();
            return resolve();
        });
    }
    async internalClose() {
        let that = this;
        return new Promise(async (resolve, reject) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.close(id, res => {
                if (res && res.success)
                    resolve();
                else
                    reject(res);
            });
        });
    }
}
exports.OWWindow = OWWindow;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/timer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = void 0;
class Timer {
    constructor(delegate, id) {
        this._timerId = null;
        this.handleTimerEvent = () => {
            this._timerId = null;
            this._delegate.onTimer(this._id);
        };
        this._delegate = delegate;
        this._id = id;
    }
    static async wait(intervalInMS) {
        return new Promise(resolve => {
            setTimeout(resolve, intervalInMS);
        });
    }
    start(intervalInMS) {
        this.stop();
        this._timerId = setTimeout(this.handleTimerEvent, intervalInMS);
    }
    stop() {
        if (this._timerId == null) {
            return;
        }
        clearTimeout(this._timerId);
        this._timerId = null;
    }
}
exports.Timer = Timer;


/***/ }),

/***/ "./src/AppWindow.ts":
/*!**************************!*\
  !*** ./src/AppWindow.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppWindow = void 0;
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
class AppWindow {
    constructor(windowName) {
        this.maximized = false;
        this.mainWindow = new overwolf_api_ts_1.OWWindow('background');
        this.currWindow = new overwolf_api_ts_1.OWWindow(windowName);
        const closeButton = document.getElementById('closeButton');
        const maximizeButton = document.getElementById('maximizeButton');
        const minimizeButton = document.getElementById('minimizeButton');
        const header = document.getElementById('header');
        this.setDrag(header);
        closeButton.addEventListener('click', () => {
            this.mainWindow.close();
        });
        minimizeButton.addEventListener('click', () => {
            this.currWindow.minimize();
        });
        maximizeButton.addEventListener('click', () => {
            if (!this.maximized) {
                this.currWindow.maximize();
            }
            else {
                this.currWindow.restore();
            }
            this.maximized = !this.maximized;
        });
    }
    async getWindowState() {
        return await this.currWindow.getWindowState();
    }
    async setDrag(elem) {
        this.currWindow.dragMove(elem);
    }
}
exports.AppWindow = AppWindow;


/***/ }),

/***/ "./src/consts.ts":
/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.kHotkeys = exports.kWindowNames = exports.kGameClassIds = exports.kGamesFeatures = void 0;
exports.kGamesFeatures = new Map([
    [
        21216,
        [
            'kill',
            'killed',
            'killer',
            'revived',
            'death',
            'match',
            'match_info',
            'rank',
            'me',
            'phase',
            'location',
            'team',
            'items',
            'counters'
        ]
    ],
    [
        7764,
        [
            'match_info',
            'kill',
            'death',
            'assist',
            'headshot',
            'round_start',
            'match_start',
            'match_info',
            'match_end',
            'team_round_win',
            'bomb_planted',
            'bomb_change',
            'reloading',
            'fired',
            'weapon_change',
            'weapon_acquired',
            'info',
            'roster',
            'player_activity_change',
            'team_set',
            'replay',
            'counters',
            'mvp',
            'scoreboard',
            'kill_feed'
        ]
    ],
    [
        5426,
        [
            'live_client_data',
            'matchState',
            'match_info',
            'death',
            'respawn',
            'abilities',
            'kill',
            'assist',
            'gold',
            'minions',
            'summoner_info',
            'gameMode',
            'teams',
            'level',
            'announcer',
            'counters',
            'damage',
            'heal'
        ]
    ],
    [
        21634,
        [
            'match_info',
            'game_info'
        ]
    ],
    [
        8032,
        [
            'game_info',
            'match_info'
        ]
    ],
    [
        10844,
        [
            'game_info',
            'match_info',
            'kill',
            'death'
        ]
    ],
    [
        10906,
        [
            'kill',
            'revived',
            'death',
            'killer',
            'match',
            'match_info',
            'rank',
            'counters',
            'location',
            'me',
            'team',
            'phase',
            'map',
            'roster'
        ]
    ],
    [
        10826,
        [
            'game_info',
            'match',
            'match_info',
            'roster',
            'kill',
            'death',
            'me',
            'defuser'
        ]
    ],
    [
        21404,
        [
            'game_info',
            'match_info',
            'player',
            'location',
            'match',
            'feed',
            'connection',
            'kill',
            'death',
            'portal',
            'assist'
        ]
    ],
    [
        7212,
        [
            'kill',
            'death',
            'me',
            'match_info'
        ]
    ],
    [
        21640,
        [
            'me',
            'game_info',
            'match_info',
            'kill',
            'death'
        ]
    ],
    [
        7314,
        [
            'game_state_changed',
            'match_state_changed',
            'match_detected',
            'daytime_changed',
            'clock_time_changed',
            'ward_purchase_cooldown_changed',
            'match_ended',
            'kill',
            'assist',
            'death',
            'cs',
            'xpm',
            'gpm',
            'gold',
            'hero_leveled_up',
            'hero_respawned',
            'hero_buyback_info_changed',
            'hero_boughtback',
            'hero_health_mana_info',
            'hero_status_effect_changed',
            'hero_attributes_skilled',
            'hero_ability_skilled',
            'hero_ability_used',
            'hero_ability_cooldown_changed',
            'hero_ability_changed',
            'hero_item_cooldown_changed',
            'hero_item_changed',
            'hero_item_used',
            'hero_item_consumed',
            'hero_item_charged',
            'match_info',
            'roster',
            'party',
            'error',
            'hero_pool',
            'me',
            'game'
        ]
    ],
    [
        21626,
        [
            'match_info',
            'game_info',
            'kill',
            'death'
        ]
    ],
    [
        8954,
        [
            'game_info',
            'match_info'
        ]
    ],
]);
exports.kGameClassIds = Array.from(exports.kGamesFeatures.keys());
exports.kWindowNames = {
    inGame: 'in_game',
    desktop: 'desktop'
};
exports.kHotkeys = {
    toggle: 'sample_app_ts_showhide'
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./src/in_game/in_game.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
const AppWindow_1 = __webpack_require__(/*! ../AppWindow */ "./src/AppWindow.ts");
const consts_1 = __webpack_require__(/*! ../consts */ "./src/consts.ts");
class InGame extends AppWindow_1.AppWindow {
    constructor() {
        super(consts_1.kWindowNames.inGame);
        this._eventsLog = document.getElementById('eventsLog');
        this._infoLog = document.getElementById('infoLog');
        this.setToggleHotkeyBehavior();
        this.setToggleHotkeyText();
    }
    static instance() {
        if (!this._instance) {
            this._instance = new InGame();
        }
        return this._instance;
    }
    async run() {
        const gameClassId = await this.getCurrentGameClassId();
        const gameFeatures = consts_1.kGamesFeatures.get(gameClassId);
        if (gameFeatures && gameFeatures.length) {
            this._gameEventsListener = new overwolf_api_ts_1.OWGamesEvents({
                onInfoUpdates: this.onInfoUpdates.bind(this),
                onNewEvents: this.onNewEvents.bind(this)
            }, gameFeatures);
            this._gameEventsListener.start();
        }
    }
    onInfoUpdates(info) {
        this.logLine(this._infoLog, info, false);
    }
    onNewEvents(e) {
        const shouldHighlight = e.events.some(event => {
            switch (event.name) {
                case 'kill':
                case 'death':
                case 'assist':
                case 'level':
                case 'matchStart':
                case 'match_start':
                case 'matchEnd':
                case 'match_end':
                    return true;
            }
            return false;
        });
        this.logLine(this._eventsLog, e, shouldHighlight);
    }
    async setToggleHotkeyText() {
        const gameClassId = await this.getCurrentGameClassId();
        const hotkeyText = await overwolf_api_ts_1.OWHotkeys.getHotkeyText(consts_1.kHotkeys.toggle, gameClassId);
        const hotkeyElem = document.getElementById('hotkey');
        hotkeyElem.textContent = hotkeyText;
    }
    async setToggleHotkeyBehavior() {
        const toggleInGameWindow = async (hotkeyResult) => {
            console.log(`pressed hotkey for ${hotkeyResult.name}`);
            const inGameState = await this.getWindowState();
            if (inGameState.window_state === "normal" ||
                inGameState.window_state === "maximized") {
                this.currWindow.minimize();
            }
            else if (inGameState.window_state === "minimized" ||
                inGameState.window_state === "closed") {
                this.currWindow.restore();
            }
        };
        overwolf_api_ts_1.OWHotkeys.onHotkeyDown(consts_1.kHotkeys.toggle, toggleInGameWindow);
    }
    logLine(log, data, highlight) {
        const line = document.createElement('pre');
        line.textContent = JSON.stringify(data);
        if (highlight) {
            line.className = 'highlight';
        }
        const shouldAutoScroll = log.scrollTop + log.offsetHeight >= log.scrollHeight - 10;
        log.appendChild(line);
        if (shouldAutoScroll) {
            log.scrollTop = log.scrollHeight;
        }
    }
    async getCurrentGameClassId() {
        const info = await overwolf_api_ts_1.OWGames.getRunningGameInfo();
        return (info && info.isRunning && info.classId) ? info.classId : null;
    }
}
InGame.instance().run();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZXhhbXBsZS10cy8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctZ2FtZS1saXN0ZW5lci5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lcy1ldmVudHMuanMiLCJ3ZWJwYWNrOi8vZXhhbXBsZS10cy8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctZ2FtZXMuanMiLCJ3ZWJwYWNrOi8vZXhhbXBsZS10cy8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctaG90a2V5cy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1saXN0ZW5lci5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy13aW5kb3cuanMiLCJ3ZWJwYWNrOi8vZXhhbXBsZS10cy8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3QvdGltZXIuanMiLCJ3ZWJwYWNrOi8vZXhhbXBsZS10cy8uL3NyYy9BcHBXaW5kb3cudHMiLCJ3ZWJwYWNrOi8vZXhhbXBsZS10cy8uL3NyYy9jb25zdHMudHMiLCJ3ZWJwYWNrOi8vZXhhbXBsZS10cy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vc3JjL2luX2dhbWUvaW5fZ2FtZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWUtbGlzdGVuZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZXMtZXZlbnRzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWVzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWhvdGtleXNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctbGlzdGVuZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctd2luZG93XCIpLCBleHBvcnRzKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVMaXN0ZW5lciA9IHZvaWQgMDtcclxuY29uc3Qgb3dfbGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL293LWxpc3RlbmVyXCIpO1xyXG5jbGFzcyBPV0dhbWVMaXN0ZW5lciBleHRlbmRzIG93X2xpc3RlbmVyXzEuT1dMaXN0ZW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSkge1xyXG4gICAgICAgIHN1cGVyKGRlbGVnYXRlKTtcclxuICAgICAgICB0aGlzLm9uR2FtZUluZm9VcGRhdGVkID0gKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZSB8fCAhdXBkYXRlLmdhbWVJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF1cGRhdGUucnVubmluZ0NoYW5nZWQgJiYgIXVwZGF0ZS5nYW1lQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1cGRhdGUuZ2FtZUluZm8uaXNSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQodXBkYXRlLmdhbWVJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZUVuZGVkKHVwZGF0ZS5nYW1lSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25SdW5uaW5nR2FtZUluZm8gPSAoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWluZm8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5mby5pc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZChpbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLm9uR2FtZUluZm9VcGRhdGVkLmFkZExpc3RlbmVyKHRoaXMub25HYW1lSW5mb1VwZGF0ZWQpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbyh0aGlzLm9uUnVubmluZ0dhbWVJbmZvKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMub25HYW1lSW5mb1VwZGF0ZWQucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkdhbWVJbmZvVXBkYXRlZCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVMaXN0ZW5lciA9IE9XR2FtZUxpc3RlbmVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZXNFdmVudHMgPSB2b2lkIDA7XHJcbmNvbnN0IHRpbWVyXzEgPSByZXF1aXJlKFwiLi90aW1lclwiKTtcclxuY2xhc3MgT1dHYW1lc0V2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSwgcmVxdWlyZWRGZWF0dXJlcywgZmVhdHVyZVJldHJpZXMgPSAxMCkge1xyXG4gICAgICAgIHRoaXMub25JbmZvVXBkYXRlcyA9IChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uSW5mb1VwZGF0ZXMoaW5mby5pbmZvKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25OZXdFdmVudHMgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbk5ld0V2ZW50cyhlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICAgICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcyA9IHJlcXVpcmVkRmVhdHVyZXM7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZVJldHJpZXMgPSBmZWF0dXJlUmV0cmllcztcclxuICAgIH1cclxuICAgIGFzeW5jIGdldEluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5nZXRJbmZvKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc2V0UmVxdWlyZWRGZWF0dXJlcygpIHtcclxuICAgICAgICBsZXQgdHJpZXMgPSAxLCByZXN1bHQ7XHJcbiAgICAgICAgd2hpbGUgKHRyaWVzIDw9IHRoaXMuX2ZlYXR1cmVSZXRyaWVzKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLnNldFJlcXVpcmVkRmVhdHVyZXModGhpcy5fcmVxdWlyZWRGZWF0dXJlcywgcmVzb2x2ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2V0UmVxdWlyZWRGZWF0dXJlcygpOiBzdWNjZXNzOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHJlc3VsdC5zdXBwb3J0ZWRGZWF0dXJlcy5sZW5ndGggPiAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhd2FpdCB0aW1lcl8xLlRpbWVyLndhaXQoMzAwMCk7XHJcbiAgICAgICAgICAgIHRyaWVzKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUud2Fybignc2V0UmVxdWlyZWRGZWF0dXJlcygpOiBmYWlsdXJlIGFmdGVyICcgKyB0cmllcyArICcgdHJpZXMnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uSW5mb1VwZGF0ZXMyLmFkZExpc3RlbmVyKHRoaXMub25JbmZvVXBkYXRlcyk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uTmV3RXZlbnRzLmFkZExpc3RlbmVyKHRoaXMub25OZXdFdmVudHMpO1xyXG4gICAgfVxyXG4gICAgdW5SZWdpc3RlckV2ZW50cygpIHtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25JbmZvVXBkYXRlczIucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkluZm9VcGRhdGVzKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25OZXdFdmVudHMucmVtb3ZlTGlzdGVuZXIodGhpcy5vbk5ld0V2ZW50cyk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzdGFydCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW293LWdhbWUtZXZlbnRzXSBTVEFSVGApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnNldFJlcXVpcmVkRmVhdHVyZXMoKTtcclxuICAgICAgICBjb25zdCB7IHJlcywgc3RhdHVzIH0gPSBhd2FpdCB0aGlzLmdldEluZm8oKTtcclxuICAgICAgICBpZiAocmVzICYmIHN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25JbmZvVXBkYXRlcyh7IGluZm86IHJlcyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbb3ctZ2FtZS1ldmVudHNdIFNUT1BgKTtcclxuICAgICAgICB0aGlzLnVuUmVnaXN0ZXJFdmVudHMoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZXNFdmVudHMgPSBPV0dhbWVzRXZlbnRzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZXMgPSB2b2lkIDA7XHJcbmNsYXNzIE9XR2FtZXMge1xyXG4gICAgc3RhdGljIGdldFJ1bm5pbmdHYW1lSW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UnVubmluZ0dhbWVJbmZvKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGNsYXNzSWRGcm9tR2FtZUlkKGdhbWVJZCkge1xyXG4gICAgICAgIGxldCBjbGFzc0lkID0gTWF0aC5mbG9vcihnYW1lSWQgLyAxMCk7XHJcbiAgICAgICAgcmV0dXJuIGNsYXNzSWQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcyhsaW1pdCA9IDMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFvdmVyd29sZi5nYW1lcy5nZXRSZWNlbnRseVBsYXllZEdhbWVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSZWNlbnRseVBsYXllZEdhbWVzKGxpbWl0LCByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQuZ2FtZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRHYW1lREJJbmZvKGdhbWVDbGFzc0lkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldEdhbWVEQkluZm8oZ2FtZUNsYXNzSWQsIHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lcyA9IE9XR2FtZXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dIb3RrZXlzID0gdm9pZCAwO1xyXG5jbGFzcyBPV0hvdGtleXMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIHN0YXRpYyBnZXRIb3RrZXlUZXh0KGhvdGtleUlkLCBnYW1lSWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMuZ2V0KHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhvdGtleTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZUlkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdGtleSA9IHJlc3VsdC5nbG9iYWxzLmZpbmQoaCA9PiBoLm5hbWUgPT09IGhvdGtleUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQuZ2FtZXMgJiYgcmVzdWx0LmdhbWVzW2dhbWVJZF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdGtleSA9IHJlc3VsdC5nYW1lc1tnYW1lSWRdLmZpbmQoaCA9PiBoLm5hbWUgPT09IGhvdGtleUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaG90a2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShob3RrZXkuYmluZGluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCdVTkFTU0lHTkVEJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG9uSG90a2V5RG93bihob3RrZXlJZCwgYWN0aW9uKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy5vblByZXNzZWQuYWRkTGlzdGVuZXIoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5uYW1lID09PSBob3RrZXlJZClcclxuICAgICAgICAgICAgICAgIGFjdGlvbihyZXN1bHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dIb3RrZXlzID0gT1dIb3RrZXlzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XTGlzdGVuZXIgPSB2b2lkIDA7XHJcbmNsYXNzIE9XTGlzdGVuZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUpIHtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0xpc3RlbmVyID0gT1dMaXN0ZW5lcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV1dpbmRvdyA9IHZvaWQgMDtcclxuY2xhc3MgT1dXaW5kb3cge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA9IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLl9pZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBhc3luYyByZXN0b3JlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5yZXN0b3JlKGlkLCByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuc3VjY2VzcylcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbcmVzdG9yZV0gLSBhbiBlcnJvciBvY2N1cnJlZCwgd2luZG93SWQ9JHtpZH0sIHJlYXNvbj0ke3Jlc3VsdC5lcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBtaW5pbWl6ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MubWluaW1pemUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBtYXhpbWl6ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MubWF4aW1pemUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBoaWRlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5oaWRlKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgY2xvc2UoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmdldFdpbmRvd1N0YXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJlxyXG4gICAgICAgICAgICAgICAgKHJlc3VsdC53aW5kb3dfc3RhdGUgIT09ICdjbG9zZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5pbnRlcm5hbENsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRyYWdNb3ZlKGVsZW0pIHtcclxuICAgICAgICBlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lICsgJyBkcmFnZ2FibGUnO1xyXG4gICAgICAgIGVsZW0ub25tb3VzZWRvd24gPSBlID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmRyYWdNb3ZlKHRoaXMuX25hbWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXRXaW5kb3dTdGF0ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0V2luZG93U3RhdGUoaWQsIHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldEN1cnJlbnRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldEN1cnJlbnRXaW5kb3cocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LndpbmRvdyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgb2J0YWluKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNiID0gcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIgJiYgcmVzLndpbmRvdyAmJiByZXMud2luZG93LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWQgPSByZXMud2luZG93LmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lID0gcmVzLndpbmRvdy5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcy53aW5kb3cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0Q3VycmVudFdpbmRvdyhjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm9idGFpbkRlY2xhcmVkV2luZG93KHRoaXMuX25hbWUsIGNiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgYXNzdXJlT2J0YWluZWQoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0Lm9idGFpbigpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgaW50ZXJuYWxDbG9zZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5jbG9zZShpZCwgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLnN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XV2luZG93ID0gT1dXaW5kb3c7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVGltZXIgPSB2b2lkIDA7XHJcbmNsYXNzIFRpbWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlLCBpZCkge1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGltZXJFdmVudCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uVGltZXIodGhpcy5faWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIHdhaXQoaW50ZXJ2YWxJbk1TKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGludGVydmFsSW5NUyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGFydChpbnRlcnZhbEluTVMpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gc2V0VGltZW91dCh0aGlzLmhhbmRsZVRpbWVyRXZlbnQsIGludGVydmFsSW5NUyk7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90aW1lcklkID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXJJZCk7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UaW1lciA9IFRpbWVyO1xyXG4iLCJpbXBvcnQgeyBPV1dpbmRvdyB9IGZyb20gXCJAb3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzXCI7XG5cbi8vIEEgYmFzZSBjbGFzcyBmb3IgdGhlIGFwcCdzIGZvcmVncm91bmQgd2luZG93cy5cbi8vIFNldHMgdGhlIG1vZGFsIGFuZCBkcmFnIGJlaGF2aW9ycywgd2hpY2ggYXJlIHNoYXJlZCBhY2Nyb3NzIHRoZSBkZXNrdG9wIGFuZCBpbi1nYW1lIHdpbmRvd3MuXG5leHBvcnQgY2xhc3MgQXBwV2luZG93IHtcbiAgcHJvdGVjdGVkIGN1cnJXaW5kb3c6IE9XV2luZG93O1xuICBwcm90ZWN0ZWQgbWFpbldpbmRvdzogT1dXaW5kb3c7XG4gIHByb3RlY3RlZCBtYXhpbWl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcih3aW5kb3dOYW1lKSB7XG4gICAgdGhpcy5tYWluV2luZG93ID0gbmV3IE9XV2luZG93KCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy5jdXJyV2luZG93ID0gbmV3IE9XV2luZG93KHdpbmRvd05hbWUpO1xuXG4gICAgY29uc3QgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VCdXR0b24nKTtcbiAgICBjb25zdCBtYXhpbWl6ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXhpbWl6ZUJ1dHRvbicpO1xuICAgIGNvbnN0IG1pbmltaXplQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21pbmltaXplQnV0dG9uJyk7XG5cbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyJyk7XG5cbiAgICB0aGlzLnNldERyYWcoaGVhZGVyKTtcblxuICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5tYWluV2luZG93LmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBtaW5pbWl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuY3VycldpbmRvdy5taW5pbWl6ZSgpO1xuICAgIH0pO1xuXG4gICAgbWF4aW1pemVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMubWF4aW1pemVkKSB7XG4gICAgICAgIHRoaXMuY3VycldpbmRvdy5tYXhpbWl6ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyV2luZG93LnJlc3RvcmUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tYXhpbWl6ZWQgPSAhdGhpcy5tYXhpbWl6ZWQ7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0V2luZG93U3RhdGUoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuY3VycldpbmRvdy5nZXRXaW5kb3dTdGF0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzZXREcmFnKGVsZW0pIHtcbiAgICB0aGlzLmN1cnJXaW5kb3cuZHJhZ01vdmUoZWxlbSk7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBrR2FtZXNGZWF0dXJlcyA9IG5ldyBNYXA8bnVtYmVyLCBzdHJpbmdbXT4oW1xuICAvLyBGb3J0bml0ZVxuICBbXG4gICAgMjEyMTYsXG4gICAgW1xuICAgICAgJ2tpbGwnLFxuICAgICAgJ2tpbGxlZCcsXG4gICAgICAna2lsbGVyJyxcbiAgICAgICdyZXZpdmVkJyxcbiAgICAgICdkZWF0aCcsXG4gICAgICAnbWF0Y2gnLFxuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ3JhbmsnLFxuICAgICAgJ21lJyxcbiAgICAgICdwaGFzZScsXG4gICAgICAnbG9jYXRpb24nLFxuICAgICAgJ3RlYW0nLFxuICAgICAgJ2l0ZW1zJyxcbiAgICAgICdjb3VudGVycydcbiAgICBdXG4gIF0sXG4gIC8vIENTR09cbiAgW1xuICAgIDc3NjQsXG4gICAgW1xuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ2tpbGwnLFxuICAgICAgJ2RlYXRoJyxcbiAgICAgICdhc3Npc3QnLFxuICAgICAgJ2hlYWRzaG90JyxcbiAgICAgICdyb3VuZF9zdGFydCcsXG4gICAgICAnbWF0Y2hfc3RhcnQnLFxuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ21hdGNoX2VuZCcsXG4gICAgICAndGVhbV9yb3VuZF93aW4nLFxuICAgICAgJ2JvbWJfcGxhbnRlZCcsXG4gICAgICAnYm9tYl9jaGFuZ2UnLFxuICAgICAgJ3JlbG9hZGluZycsXG4gICAgICAnZmlyZWQnLFxuICAgICAgJ3dlYXBvbl9jaGFuZ2UnLFxuICAgICAgJ3dlYXBvbl9hY3F1aXJlZCcsXG4gICAgICAnaW5mbycsXG4gICAgICAncm9zdGVyJyxcbiAgICAgICdwbGF5ZXJfYWN0aXZpdHlfY2hhbmdlJyxcbiAgICAgICd0ZWFtX3NldCcsXG4gICAgICAncmVwbGF5JyxcbiAgICAgICdjb3VudGVycycsXG4gICAgICAnbXZwJyxcbiAgICAgICdzY29yZWJvYXJkJyxcbiAgICAgICdraWxsX2ZlZWQnXG4gICAgXVxuICBdLFxuICAvLyBMZWFndWUgb2YgTGVnZW5kc1xuICBbXG4gICAgNTQyNixcbiAgICBbXG4gICAgICAnbGl2ZV9jbGllbnRfZGF0YScsXG4gICAgICAnbWF0Y2hTdGF0ZScsXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAnZGVhdGgnLFxuICAgICAgJ3Jlc3Bhd24nLFxuICAgICAgJ2FiaWxpdGllcycsXG4gICAgICAna2lsbCcsXG4gICAgICAnYXNzaXN0JyxcbiAgICAgICdnb2xkJyxcbiAgICAgICdtaW5pb25zJyxcbiAgICAgICdzdW1tb25lcl9pbmZvJyxcbiAgICAgICdnYW1lTW9kZScsXG4gICAgICAndGVhbXMnLFxuICAgICAgJ2xldmVsJyxcbiAgICAgICdhbm5vdW5jZXInLFxuICAgICAgJ2NvdW50ZXJzJyxcbiAgICAgICdkYW1hZ2UnLFxuICAgICAgJ2hlYWwnXG4gICAgXVxuICBdLFxuICAvLyBFc2NhcGUgRnJvbSBUYXJrb3ZcbiAgW1xuICAgIDIxNjM0LFxuICAgIFtcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdnYW1lX2luZm8nXG4gICAgXVxuICBdLFxuICAvLyBNaW5lY3JhZnRcbiAgW1xuICAgIDgwMzIsXG4gICAgW1xuICAgICAgJ2dhbWVfaW5mbycsXG4gICAgICAnbWF0Y2hfaW5mbydcbiAgICBdXG4gIF0sXG4gIC8vIE92ZXJ3YXRjaFxuICBbXG4gICAgMTA4NDQsXG4gICAgW1xuICAgICAgJ2dhbWVfaW5mbycsXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAna2lsbCcsXG4gICAgICAnZGVhdGgnXG4gICAgXVxuICBdLFxuICAvLyBQVUJHXG4gIFtcbiAgICAxMDkwNixcbiAgICBbXG4gICAgICAna2lsbCcsXG4gICAgICAncmV2aXZlZCcsXG4gICAgICAnZGVhdGgnLFxuICAgICAgJ2tpbGxlcicsXG4gICAgICAnbWF0Y2gnLFxuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ3JhbmsnLFxuICAgICAgJ2NvdW50ZXJzJyxcbiAgICAgICdsb2NhdGlvbicsXG4gICAgICAnbWUnLFxuICAgICAgJ3RlYW0nLFxuICAgICAgJ3BoYXNlJyxcbiAgICAgICdtYXAnLFxuICAgICAgJ3Jvc3RlcidcbiAgICBdXG4gIF0sXG4gIC8vIFJhaW5ib3cgU2l4IFNpZWdlXG4gIFtcbiAgICAxMDgyNixcbiAgICBbXG4gICAgICAnZ2FtZV9pbmZvJyxcbiAgICAgICdtYXRjaCcsXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAncm9zdGVyJyxcbiAgICAgICdraWxsJyxcbiAgICAgICdkZWF0aCcsXG4gICAgICAnbWUnLFxuICAgICAgJ2RlZnVzZXInXG4gICAgXVxuICBdLFxuICAvLyBTcGxpdGdhdGU6IEFyZW5hIFdhcmZhcmVcbiAgW1xuICAgIDIxNDA0LFxuICAgIFtcbiAgICAgICdnYW1lX2luZm8nLFxuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ3BsYXllcicsXG4gICAgICAnbG9jYXRpb24nLFxuICAgICAgJ21hdGNoJyxcbiAgICAgICdmZWVkJyxcbiAgICAgICdjb25uZWN0aW9uJyxcbiAgICAgICdraWxsJyxcbiAgICAgICdkZWF0aCcsXG4gICAgICAncG9ydGFsJyxcbiAgICAgICdhc3Npc3QnXG4gICAgXVxuICBdLFxuICAvLyBQYXRoIG9mIEV4aWxlXG4gIFtcbiAgICA3MjEyLFxuICAgIFtcbiAgICAgICdraWxsJyxcbiAgICAgICdkZWF0aCcsXG4gICAgICAnbWUnLFxuICAgICAgJ21hdGNoX2luZm8nXG4gICAgXVxuICBdLFxuICAvLyBWYWxvcmFudFxuICBbXG4gICAgMjE2NDAsXG4gICAgW1xuICAgICAgJ21lJyxcbiAgICAgICdnYW1lX2luZm8nLFxuICAgICAgJ21hdGNoX2luZm8nLFxuICAgICAgJ2tpbGwnLFxuICAgICAgJ2RlYXRoJ1xuICAgIF1cbiAgXSxcbiAgLy8gRG90YSAyXG4gIFtcbiAgICA3MzE0LFxuICAgIFtcbiAgICAgICdnYW1lX3N0YXRlX2NoYW5nZWQnLFxuICAgICAgJ21hdGNoX3N0YXRlX2NoYW5nZWQnLFxuICAgICAgJ21hdGNoX2RldGVjdGVkJyxcbiAgICAgICdkYXl0aW1lX2NoYW5nZWQnLFxuICAgICAgJ2Nsb2NrX3RpbWVfY2hhbmdlZCcsXG4gICAgICAnd2FyZF9wdXJjaGFzZV9jb29sZG93bl9jaGFuZ2VkJyxcbiAgICAgICdtYXRjaF9lbmRlZCcsXG4gICAgICAna2lsbCcsXG4gICAgICAnYXNzaXN0JyxcbiAgICAgICdkZWF0aCcsXG4gICAgICAnY3MnLFxuICAgICAgJ3hwbScsXG4gICAgICAnZ3BtJyxcbiAgICAgICdnb2xkJyxcbiAgICAgICdoZXJvX2xldmVsZWRfdXAnLFxuICAgICAgJ2hlcm9fcmVzcGF3bmVkJyxcbiAgICAgICdoZXJvX2J1eWJhY2tfaW5mb19jaGFuZ2VkJyxcbiAgICAgICdoZXJvX2JvdWdodGJhY2snLFxuICAgICAgJ2hlcm9faGVhbHRoX21hbmFfaW5mbycsXG4gICAgICAnaGVyb19zdGF0dXNfZWZmZWN0X2NoYW5nZWQnLFxuICAgICAgJ2hlcm9fYXR0cmlidXRlc19za2lsbGVkJyxcbiAgICAgICdoZXJvX2FiaWxpdHlfc2tpbGxlZCcsXG4gICAgICAnaGVyb19hYmlsaXR5X3VzZWQnLFxuICAgICAgJ2hlcm9fYWJpbGl0eV9jb29sZG93bl9jaGFuZ2VkJyxcbiAgICAgICdoZXJvX2FiaWxpdHlfY2hhbmdlZCcsXG4gICAgICAnaGVyb19pdGVtX2Nvb2xkb3duX2NoYW5nZWQnLFxuICAgICAgJ2hlcm9faXRlbV9jaGFuZ2VkJyxcbiAgICAgICdoZXJvX2l0ZW1fdXNlZCcsXG4gICAgICAnaGVyb19pdGVtX2NvbnN1bWVkJyxcbiAgICAgICdoZXJvX2l0ZW1fY2hhcmdlZCcsXG4gICAgICAnbWF0Y2hfaW5mbycsXG4gICAgICAncm9zdGVyJyxcbiAgICAgICdwYXJ0eScsXG4gICAgICAnZXJyb3InLFxuICAgICAgJ2hlcm9fcG9vbCcsXG4gICAgICAnbWUnLFxuICAgICAgJ2dhbWUnXG4gICAgXVxuICBdLFxuICAvLyBDYWxsIG9mIER1dHk6IFdhcnpvbmVcbiAgW1xuICAgIDIxNjI2LFxuICAgIFtcbiAgICAgICdtYXRjaF9pbmZvJyxcbiAgICAgICdnYW1lX2luZm8nLFxuICAgICAgJ2tpbGwnLFxuICAgICAgJ2RlYXRoJ1xuICAgIF1cbiAgXSxcbiAgLy8gV2FyZnJhbWVcbiAgW1xuICAgIDg5NTQsXG4gICAgW1xuICAgICAgJ2dhbWVfaW5mbycsXG4gICAgICAnbWF0Y2hfaW5mbydcbiAgICBdXG4gIF0sXG5dKTtcblxuZXhwb3J0IGNvbnN0IGtHYW1lQ2xhc3NJZHMgPSBBcnJheS5mcm9tKGtHYW1lc0ZlYXR1cmVzLmtleXMoKSk7XG5cbmV4cG9ydCBjb25zdCBrV2luZG93TmFtZXMgPSB7XG4gIGluR2FtZTogJ2luX2dhbWUnLFxuICBkZXNrdG9wOiAnZGVza3RvcCdcbn07XG5cbmV4cG9ydCBjb25zdCBrSG90a2V5cyA9IHtcbiAgdG9nZ2xlOiAnc2FtcGxlX2FwcF90c19zaG93aGlkZSdcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHtcbiAgT1dHYW1lcyxcbiAgT1dHYW1lc0V2ZW50cyxcbiAgT1dIb3RrZXlzXG59IGZyb20gXCJAb3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzXCI7XG5cbmltcG9ydCB7IEFwcFdpbmRvdyB9IGZyb20gXCIuLi9BcHBXaW5kb3dcIjtcbmltcG9ydCB7IGtIb3RrZXlzLCBrV2luZG93TmFtZXMsIGtHYW1lc0ZlYXR1cmVzIH0gZnJvbSBcIi4uL2NvbnN0c1wiO1xuXG5pbXBvcnQgV2luZG93U3RhdGUgPSBvdmVyd29sZi53aW5kb3dzLldpbmRvd1N0YXRlRXg7XG5cbi8vIFRoZSB3aW5kb3cgZGlzcGxheWVkIGluLWdhbWUgd2hpbGUgYSBnYW1lIGlzIHJ1bm5pbmcuXG4vLyBJdCBsaXN0ZW5zIHRvIGFsbCBpbmZvIGV2ZW50cyBhbmQgdG8gdGhlIGdhbWUgZXZlbnRzIGxpc3RlZCBpbiB0aGUgY29uc3RzLnRzIGZpbGVcbi8vIGFuZCB3cml0ZXMgdGhlbSB0byB0aGUgcmVsZXZhbnQgbG9nIHVzaW5nIDxwcmU+IHRhZ3MuXG4vLyBUaGUgd2luZG93IGFsc28gc2V0cyB1cCBDdHJsK0YgYXMgdGhlIG1pbmltaXplL3Jlc3RvcmUgaG90a2V5LlxuLy8gTGlrZSB0aGUgYmFja2dyb3VuZCB3aW5kb3csIGl0IGFsc28gaW1wbGVtZW50cyB0aGUgU2luZ2xldG9uIGRlc2lnbiBwYXR0ZXJuLlxuY2xhc3MgSW5HYW1lIGV4dGVuZHMgQXBwV2luZG93IHtcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBJbkdhbWU7XG4gIHByaXZhdGUgX2dhbWVFdmVudHNMaXN0ZW5lcjogT1dHYW1lc0V2ZW50cztcbiAgcHJpdmF0ZSBfZXZlbnRzTG9nOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBfaW5mb0xvZzogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihrV2luZG93TmFtZXMuaW5HYW1lKTtcblxuICAgIHRoaXMuX2V2ZW50c0xvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdldmVudHNMb2cnKTtcbiAgICB0aGlzLl9pbmZvTG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZm9Mb2cnKTtcblxuICAgIHRoaXMuc2V0VG9nZ2xlSG90a2V5QmVoYXZpb3IoKTtcbiAgICB0aGlzLnNldFRvZ2dsZUhvdGtleVRleHQoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2UoKSB7XG4gICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xuICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgSW5HYW1lKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJ1bigpIHtcbiAgICBjb25zdCBnYW1lQ2xhc3NJZCA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudEdhbWVDbGFzc0lkKCk7XG5cbiAgICBjb25zdCBnYW1lRmVhdHVyZXMgPSBrR2FtZXNGZWF0dXJlcy5nZXQoZ2FtZUNsYXNzSWQpO1xuXG4gICAgaWYgKGdhbWVGZWF0dXJlcyAmJiBnYW1lRmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9nYW1lRXZlbnRzTGlzdGVuZXIgPSBuZXcgT1dHYW1lc0V2ZW50cyhcbiAgICAgICAge1xuICAgICAgICAgIG9uSW5mb1VwZGF0ZXM6IHRoaXMub25JbmZvVXBkYXRlcy5iaW5kKHRoaXMpLFxuICAgICAgICAgIG9uTmV3RXZlbnRzOiB0aGlzLm9uTmV3RXZlbnRzLmJpbmQodGhpcylcbiAgICAgICAgfSxcbiAgICAgICAgZ2FtZUZlYXR1cmVzXG4gICAgICApO1xuXG4gICAgICB0aGlzLl9nYW1lRXZlbnRzTGlzdGVuZXIuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uSW5mb1VwZGF0ZXMoaW5mbykge1xuICAgIHRoaXMubG9nTGluZSh0aGlzLl9pbmZvTG9nLCBpbmZvLCBmYWxzZSk7XG4gIH1cblxuICAvLyBTcGVjaWFsIGV2ZW50cyB3aWxsIGJlIGhpZ2hsaWdodGVkIGluIHRoZSBldmVudCBsb2dcbiAgcHJpdmF0ZSBvbk5ld0V2ZW50cyhlKSB7XG4gICAgY29uc3Qgc2hvdWxkSGlnaGxpZ2h0ID0gZS5ldmVudHMuc29tZShldmVudCA9PiB7XG4gICAgICBzd2l0Y2ggKGV2ZW50Lm5hbWUpIHtcbiAgICAgICAgY2FzZSAna2lsbCc6XG4gICAgICAgIGNhc2UgJ2RlYXRoJzpcbiAgICAgICAgY2FzZSAnYXNzaXN0JzpcbiAgICAgICAgY2FzZSAnbGV2ZWwnOlxuICAgICAgICBjYXNlICdtYXRjaFN0YXJ0JzpcbiAgICAgICAgY2FzZSAnbWF0Y2hfc3RhcnQnOlxuICAgICAgICBjYXNlICdtYXRjaEVuZCc6XG4gICAgICAgIGNhc2UgJ21hdGNoX2VuZCc6XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pO1xuICAgIHRoaXMubG9nTGluZSh0aGlzLl9ldmVudHNMb2csIGUsIHNob3VsZEhpZ2hsaWdodCk7XG4gIH1cblxuICAvLyBEaXNwbGF5cyB0aGUgdG9nZ2xlIG1pbmltaXplL3Jlc3RvcmUgaG90a2V5IGluIHRoZSB3aW5kb3cgaGVhZGVyXG4gIHByaXZhdGUgYXN5bmMgc2V0VG9nZ2xlSG90a2V5VGV4dCgpIHtcbiAgICBjb25zdCBnYW1lQ2xhc3NJZCA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudEdhbWVDbGFzc0lkKCk7XG4gICAgY29uc3QgaG90a2V5VGV4dCA9IGF3YWl0IE9XSG90a2V5cy5nZXRIb3RrZXlUZXh0KGtIb3RrZXlzLnRvZ2dsZSwgZ2FtZUNsYXNzSWQpO1xuICAgIGNvbnN0IGhvdGtleUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG90a2V5Jyk7XG4gICAgaG90a2V5RWxlbS50ZXh0Q29udGVudCA9IGhvdGtleVRleHQ7XG4gIH1cblxuICAvLyBTZXRzIHRvZ2dsZUluR2FtZVdpbmRvdyBhcyB0aGUgYmVoYXZpb3IgZm9yIHRoZSBDdHJsK0YgaG90a2V5XG4gIHByaXZhdGUgYXN5bmMgc2V0VG9nZ2xlSG90a2V5QmVoYXZpb3IoKSB7XG4gICAgY29uc3QgdG9nZ2xlSW5HYW1lV2luZG93ID0gYXN5bmMgKFxuICAgICAgaG90a2V5UmVzdWx0OiBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLk9uUHJlc3NlZEV2ZW50XG4gICAgKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgcHJlc3NlZCBob3RrZXkgZm9yICR7aG90a2V5UmVzdWx0Lm5hbWV9YCk7XG4gICAgICBjb25zdCBpbkdhbWVTdGF0ZSA9IGF3YWl0IHRoaXMuZ2V0V2luZG93U3RhdGUoKTtcblxuICAgICAgaWYgKGluR2FtZVN0YXRlLndpbmRvd19zdGF0ZSA9PT0gV2luZG93U3RhdGUuTk9STUFMIHx8XG4gICAgICAgIGluR2FtZVN0YXRlLndpbmRvd19zdGF0ZSA9PT0gV2luZG93U3RhdGUuTUFYSU1JWkVEKSB7XG4gICAgICAgIHRoaXMuY3VycldpbmRvdy5taW5pbWl6ZSgpO1xuICAgICAgfSBlbHNlIGlmIChpbkdhbWVTdGF0ZS53aW5kb3dfc3RhdGUgPT09IFdpbmRvd1N0YXRlLk1JTklNSVpFRCB8fFxuICAgICAgICBpbkdhbWVTdGF0ZS53aW5kb3dfc3RhdGUgPT09IFdpbmRvd1N0YXRlLkNMT1NFRCkge1xuICAgICAgICB0aGlzLmN1cnJXaW5kb3cucmVzdG9yZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIE9XSG90a2V5cy5vbkhvdGtleURvd24oa0hvdGtleXMudG9nZ2xlLCB0b2dnbGVJbkdhbWVXaW5kb3cpO1xuICB9XG5cbiAgLy8gQXBwZW5kcyBhIG5ldyBsaW5lIHRvIHRoZSBzcGVjaWZpZWQgbG9nXG4gIHByaXZhdGUgbG9nTGluZShsb2c6IEhUTUxFbGVtZW50LCBkYXRhLCBoaWdobGlnaHQpIHtcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncHJlJyk7XG4gICAgbGluZS50ZXh0Q29udGVudCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXG4gICAgaWYgKGhpZ2hsaWdodCkge1xuICAgICAgbGluZS5jbGFzc05hbWUgPSAnaGlnaGxpZ2h0JztcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBzY3JvbGwgaXMgbmVhciBib3R0b21cbiAgICBjb25zdCBzaG91bGRBdXRvU2Nyb2xsID1cbiAgICAgIGxvZy5zY3JvbGxUb3AgKyBsb2cub2Zmc2V0SGVpZ2h0ID49IGxvZy5zY3JvbGxIZWlnaHQgLSAxMDtcblxuICAgIGxvZy5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgIGlmIChzaG91bGRBdXRvU2Nyb2xsKSB7XG4gICAgICBsb2cuc2Nyb2xsVG9wID0gbG9nLnNjcm9sbEhlaWdodDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGdldEN1cnJlbnRHYW1lQ2xhc3NJZCgpOiBQcm9taXNlPG51bWJlciB8IG51bGw+IHtcbiAgICBjb25zdCBpbmZvID0gYXdhaXQgT1dHYW1lcy5nZXRSdW5uaW5nR2FtZUluZm8oKTtcblxuICAgIHJldHVybiAoaW5mbyAmJiBpbmZvLmlzUnVubmluZyAmJiBpbmZvLmNsYXNzSWQpID8gaW5mby5jbGFzc0lkIDogbnVsbDtcbiAgfVxufVxuXG5JbkdhbWUuaW5zdGFuY2UoKS5ydW4oKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==