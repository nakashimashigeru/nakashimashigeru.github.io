// ============================================================
// OtakuIQ Audio — Web Audio API 効果音
// eval() を使わず、名前付き関数として定義
// ============================================================

(function () {
  'use strict';

  /**
   * AudioContext をシングルトンで管理（ブラウザの制限対応）
   * @returns {AudioContext}
   */
  function getCtx() {
    if (!window._otakuiqAudioCtx || window._otakuiqAudioCtx.state === 'closed') {
      var AC = window.AudioContext || window.webkitAudioContext;
      window._otakuiqAudioCtx = new AC();
    }
    // suspend 状態の場合は resume を試みる
    if (window._otakuiqAudioCtx.state === 'suspended') {
      window._otakuiqAudioCtx.resume();
    }
    return window._otakuiqAudioCtx;
  }

  /**
   * 単音を再生する
   * @param {AudioContext} ctx
   * @param {number} freq  - 周波数 (Hz)
   * @param {number} start - 開始時刻 (ctx.currentTime からの秒数)
   * @param {number} dur   - 持続時間 (秒)
   * @param {number} gain  - 音量 (0〜1)
   * @param {string} type  - OscillatorType ('sine' | 'sawtooth' | 'triangle' | 'square')
   */
  function playTone(ctx, freq, start, dur, gain, type) {
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  /**
   * 正解音: 明るい上昇2音チャイム (C5 → E5)
   */
  window.otakuiqPlayCorrect = function () {
    try {
      var ctx = getCtx();
      var t = ctx.currentTime;
      playTone(ctx, 523.25, t,        0.15, 0.20, 'sine'); // C5
      playTone(ctx, 659.25, t + 0.10, 0.20, 0.18, 'sine'); // E5
    } catch (e) {
      console.warn('[OtakuIQ Audio] playCorrect failed:', e);
    }
  };

  /**
   * 不正解音: 下降する短い2音 (E4 → C4)
   */
  window.otakuiqPlayWrong = function () {
    try {
      var ctx = getCtx();
      var t = ctx.currentTime;
      playTone(ctx, 330, t,        0.12, 0.20, 'sine'); // E4
      playTone(ctx, 262, t + 0.10, 0.18, 0.18, 'sine'); // C4
    } catch (e) {
      console.warn('[OtakuIQ Audio] playWrong failed:', e);
    }
  };

  /**
   * 時間切れ音: 短い3連ビープ (A4 × 3)
   */
  window.otakuiqPlayTimeout = function () {
    try {
      var ctx = getCtx();
      var t = ctx.currentTime;
      playTone(ctx, 440, t,        0.08, 0.18, 'sine'); // A4
      playTone(ctx, 440, t + 0.12, 0.08, 0.18, 'sine'); // A4
      playTone(ctx, 440, t + 0.24, 0.08, 0.18, 'sine'); // A4
    } catch (e) {
      console.warn('[OtakuIQ Audio] playTimeout failed:', e);
    }
  };

  // ── ドラゴンモード専用効果音 ──

  /**
   * ドラゴン正解音: カンフー打撃音風（鋭いアタック + 低音インパクト）
   */
  window.otakuiqPlayDragonCorrect = function () {
    try {
      var ctx = getCtx();
      var t = ctx.currentTime;
      // 高周波の鋭いアタック
      playTone(ctx, 1200, t, 0.06, 0.22, 'square');
      // 低音のインパクトボディ
      playTone(ctx, 180, t + 0.02, 0.12, 0.20, 'sawtooth');
      // 余韻
      playTone(ctx, 400, t + 0.06, 0.10, 0.08, 'sine');
    } catch (e) {
      console.warn('[OtakuIQ Audio] playDragonCorrect failed:', e);
    }
  };

  /**
   * ドラゴン不正解音: 低く不穏なバズ音
   */
  window.otakuiqPlayDragonWrong = function () {
    try {
      var ctx = getCtx();
      var t = ctx.currentTime;
      // メインのバズ音
      playTone(ctx, 90, t, 0.30, 0.18, 'sawtooth');
      // デチューンで不穏さを追加
      playTone(ctx, 95, t, 0.28, 0.10, 'sawtooth');
    } catch (e) {
      console.warn('[OtakuIQ Audio] playDragonWrong failed:', e);
    }
  };

  /**
   * ドラゴン時間切れ音: 鋭い警告音
   */
  window.otakuiqPlayDragonTimeout = function () {
    try {
      var ctx = getCtx();
      var t = ctx.currentTime;
      playTone(ctx, 600, t,        0.06, 0.20, 'square');
      playTone(ctx, 500, t + 0.10, 0.06, 0.20, 'square');
      playTone(ctx, 400, t + 0.20, 0.10, 0.18, 'square');
    } catch (e) {
      console.warn('[OtakuIQ Audio] playDragonTimeout failed:', e);
    }
  };

  /**
   * ドラゴンクイズ完了音: ドラマチックな上昇フレーズ
   */
  window.otakuiqPlayDragonComplete = function () {
    try {
      var ctx = getCtx();
      var t = ctx.currentTime;
      // 低音の土台
      playTone(ctx, 60, t, 0.60, 0.12, 'sine');
      // 上昇する4音フレーズ
      playTone(ctx, 300, t,        0.14, 0.18, 'square');
      playTone(ctx, 400, t + 0.12, 0.14, 0.18, 'square');
      playTone(ctx, 600, t + 0.24, 0.14, 0.20, 'square');
      playTone(ctx, 900, t + 0.36, 0.30, 0.22, 'square');
    } catch (e) {
      console.warn('[OtakuIQ Audio] playDragonComplete failed:', e);
    }
  };
})();
