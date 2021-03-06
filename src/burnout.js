import createMap from './elements/createMap';
import createCamera from './elements/createCamera';
import createBlock from './elements/createBlock';
import createAvatar from './elements/createAvatar';
import setKeyboardControls from './controls/setKeyboardControls';

/**
 * Wrapper function for 2D game engine for manage collisions.
 *
 * @returns {object} List of methods for create and controls a 2d game.
 *
 */

const burnout = () => {

  /**
   * @constant states - Store all states 
   * @type {object}
  */

  const states = {
    mapRef: null,
    viewRef: null,
    blocksRefs: [],
    collisionBlocksPositions: [],
    blockSize: null,
    avatar: {
      ref: null,
      startPosition: null,
    },
  };

  return {

    /**
     * Create all basic DOM elements (map and view)
     * for position and view the game layout.
     *
     * @param {object} configs - All configs for Grid layout design.
     * @param {boolean} developer - Developer mode
     * @param {number} configs.blockSize - Size of all grid blocks.
     * @param {object} configs.map - Map columns and rows positions.
     * @param {number} configs.map.cols - Map columns positions.
     * @param {number} configs.map.rows - Map rows positions.
     * @param {object} configs.view - View columns and rows positions.
     * @param {number} configs.view.cols - View columns positions.
     * @param {number} configs.view.rows - View rows positions.
     *
     * param example:
     * 
     * {
     *  blockSize: 10,
     *  map: {
     *   cols: 30,
     *   rows: 30,
     *  },
     *  view: {
     *   cols: 15,
     *   rows: 15,
     *  },
     * }
     */

    defineMap: configs => {
      const map = createMap(configs.map, configs.blockSize);
      const view = createCamera(configs.view, configs.blockSize);

      if (configs.developer) {
        map.style.border = `1px solid`;
        view.style.border = `1px solid red`;
        view.style.overflow = `visible`;
      }

      view.appendChild(map);

      states.viewRef = view;
      states.mapRef = map;
      states.blockSize = configs.blockSize;
    },

    /**
     * Create a block and register for collision.
     *
     * @param {object} configs - All block configs.
     * @param {string} configs.className - The block CSS class.
     * @param {boolean} configs.collision - Register for collisons.
     * @param {object} configs.position - Block position in map.
     * @param {number} configs.position.rowStart - Start row position.
     * @param {number} configs.position.columnStart - Start column position.
     * @param {number} configs.position.rowEnd - End row position.
     * @param {number} configs.position.columnEnd - End column position.
     *
     * param example:
     * 
     * {
     *  className: 'block-a',
     *  collision: true,
     *  position: {
     *   rowStart: 20,
     *   columnStart: 20,
     *   rowEnd: 21,
     *   columnEnd: 21,
     *  }
     * }
     */

    defineBlock: configs => {
      const block = createBlock(configs);
      
      if (configs.collision) {
        states.collisionBlocksPositions.push(configs.position);
      }

      states.blocksRefs.push(block);
    },

    /**
     * Create the avatar. 
     *
     * @param {object} configs - All avatar configs.
     * @param {string} configs.className - The avatar CSS class.
     * @param {object} configs.position - Avatar position in map.
     * @param {number} configs.position.rowStart - Start row position.
     * @param {number} configs.position.columnStart - Start column position.
     * @param {number} configs.position.rowEnd - End row position.
     * @param {number} configs.position.columnEnd - End column position.
     *
     * param example:
     * 
     * {
     *  className: 'ash',
     *  position: {
     *   rowStart: 20,
     *   columnStart: 20,
     *   rowEnd: 21,
     *   columnEnd: 21,
     *  }
     * }
     */

    defineAvatar: configs => {
      const avatar = createAvatar(configs);

      states.avatar.ref = avatar;
      states.avatar.startPosition = configs.position;
    },

    /**
     * Mount all map, append in the DOM and set game controls. 
     *
     * @param {object} container - DOM element for append all dynamic elements.
     *
     */

    renderMap: container => {
      states.blocksRefs.forEach(block => {
        states.mapRef.appendChild(block);
      });

      states.mapRef.appendChild(states.avatar.ref);
      container.appendChild(states.viewRef);
    },

    /**
     * Create all game controls.
     *
     * @param {object} configs - All game controls configs.
     * @param {object} configs.keyboard - All keyboard game controls configs.
     * @param {number} configs.keyboard.up - Keycode up movement.
     * @param {number} configs.keyboard.down - Keycode down movement.
     * @param {number} configs.keyboard.left - Keycode left movement.
     * @param {number} configs.keyboard.right - Keycode right movement.
     *
     * param example:
     *
     * {
     *  keyboard: {
     *    up: 20,
     *    down: 20,
     *    left: 21,
     *    right: 21,
     *  }
     * }
     */

    defineControls: (configs) => {

      if(configs.keyboard) {
        setKeyboardControls(
          states.avatar,
          states.mapRef,
          states.collisionBlocksPositions,
          states.blockSize,
          configs.keyboard
        );
      }

    },

  };

};

export default burnout();