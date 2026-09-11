const SWIPE_MIN_DISTANCE = 28;
const SWIPE_MAX_TIME = 600;
const TAP_MAX_DISTANCE = 16;

/**
 * One place for every way a player can steer: arrow keys / WASD, swipes, and
 * taps. On-screen buttons call the same handlers directly (see
 * TouchControls), so all three input paths stay in sync.
 */
export default class InputController {
  constructor(scene, handlers) {
    this.scene = scene;
    this.handlers = handlers;
    this.enabled = true;
    /** Set by GameScene so gestures starting on a button are ignored. */
    this.isOverControls = () => false;

    const keyboard = scene.input.keyboard;
    // Stop the arrows and space bar from scrolling the host page.
    keyboard.addCapture('LEFT,RIGHT,UP,DOWN,SPACE');

    this.onKeyDown = (event) => {
      if (!this.enabled) return;
      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          handlers.onLeft?.();
          break;
        case 'ArrowRight':
        case 'KeyD':
          handlers.onRight?.();
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          event.preventDefault?.();
          handlers.onJump?.();
          break;
        case 'KeyP':
        case 'Escape':
          handlers.onPause?.();
          break;
        default:
          break;
      }
    };
    keyboard.on('keydown', this.onKeyDown);

    this.onPointerDown = (pointer) => {
      this.swipeStart = { x: pointer.x, y: pointer.y, time: pointer.downTime };
      this.swipeFromControls = this.isOverControls(pointer.x, pointer.y);
    };

    this.onPointerUp = (pointer) => {
      if (!this.enabled || !this.swipeStart || this.swipeFromControls) {
        this.swipeStart = null;
        return;
      }

      const dx = pointer.x - this.swipeStart.x;
      const dy = pointer.y - this.swipeStart.y;
      const elapsed = pointer.upTime - this.swipeStart.time;
      this.swipeStart = null;

      if (elapsed > SWIPE_MAX_TIME) return;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < TAP_MAX_DISTANCE && absY < TAP_MAX_DISTANCE) {
        handlers.onTap?.(pointer);
        return;
      }

      if (absX > absY && absX >= SWIPE_MIN_DISTANCE) {
        (dx < 0 ? handlers.onLeft : handlers.onRight)?.();
      } else if (absY >= SWIPE_MIN_DISTANCE && dy < 0) {
        handlers.onJump?.();
      }
    };

    scene.input.on('pointerdown', this.onPointerDown);
    scene.input.on('pointerup', this.onPointerUp);

    scene.events.once('shutdown', () => this.destroy());
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  destroy() {
    this.scene.input.keyboard?.off('keydown', this.onKeyDown);
    this.scene.input.off('pointerdown', this.onPointerDown);
    this.scene.input.off('pointerup', this.onPointerUp);
  }
}
