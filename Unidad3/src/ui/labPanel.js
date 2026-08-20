// --- ESTILOS SYNTHWAVE / NEON INYECTADOS DINÁMICAMENTE ---
const synthwaveStyles = document.createElement('style')
synthwaveStyles.textContent = `
  .panel {
    position: fixed;
    top: 16px;
    right: 16px;
    width: 320px;
    max-height: calc(100vh - 32px);
    overflow-y: auto;
    background: rgba(10, 5, 25, 0.92);
    border: 2px solid #01cdfe;
    box-shadow: 0 0 20px rgba(1, 205, 254, 0.4), inset 0 0 15px rgba(255, 113, 206, 0.15);
    font-family: 'Courier New', Courier, monospace;
    color: #fff;
    padding: 16px;
    z-index: 100;
    backdrop-filter: blur(8px);
    border-radius: 4px;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .panel.hidden {
    transform: translateX(120%);
    opacity: 0;
    pointer-events: none;
  }
  .panel h1 {
    font-size: 1.1rem;
    color: #ff71ce;
    text-shadow: 0 0 8px rgba(255, 113, 206, 0.8);
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 8px;
    letter-spacing: 2px;
    border-bottom: 1px dashed #ff71ce;
    padding-bottom: 6px;
  }
  .panel p {
    font-size: 0.75rem;
    color: #b967ff;
    margin-bottom: 12px;
    line-height: 1.4;
    text-shadow: 0 0 4px rgba(185, 103, 255, 0.4);
  }
  .panel .group {
    background: rgba(20, 10, 40, 0.6);
    border: 1px solid #b967ff;
    padding: 10px;
    margin-bottom: 12px;
    border-radius: 3px;
    box-shadow: inset 0 0 8px rgba(185, 103, 255, 0.15);
  }
  .panel h2 {
    font-size: 0.85rem;
    color: #01cdfe;
    text-shadow: 0 0 6px rgba(1, 205, 254, 0.6);
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 8px;
    letter-spacing: 1px;
  }
  .panel .row {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
    font-size: 0.75rem;
  }
  .panel .row label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    color: #fff;
  }
  .panel .row .value {
    color: #ff71ce;
    font-weight: bold;
    text-shadow: 0 0 5px rgba(255, 113, 206, 0.6);
  }
  .panel input[type="range"] {
    appearance: none;
    width: 100%;
    height: 6px;
    background: #120428;
    border: 1px solid #01cdfe;
    border-radius: 3px;
    outline: none;
  }
  .panel input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    background: #ff71ce;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 8px #ff71ce;
  }
  .panel input[type="checkbox"] {
    appearance: none;
    width: 14px;
    height: 14px;
    background: #120428;
    border: 1px solid #01cdfe;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
  }
  .panel input[type="checkbox"]:checked {
    background: #ff71ce;
    box-shadow: 0 0 8px #ff71ce;
  }
  .panel input[type="color"] {
    appearance: none;
    border: 1px solid #01cdfe;
    width: 28px;
    height: 18px;
    background: transparent;
    cursor: pointer;
    border-radius: 2px;
  }
  .panel button {
    width: 100%;
    background: linear-gradient(90deg, #120428, #2a0845);
    color: #01cdfe;
    border: 1px solid #01cdfe;
    padding: 8px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    margin-bottom: 6px;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(1, 205, 254, 0.3);
    transition: all 0.2s ease;
  }
  .panel button:hover {
    background: #01cdfe;
    color: #120428;
    box-shadow: 0 0 12px #01cdfe;
  }
`
document.head.appendChild(synthwaveStyles)

function rangeRow(
  parent,
  label,
  object,
  key,
  min,
  max,
  step,
  onInput,
  getValue,
) {
  const wrap = document.createElement('div')
  wrap.className = 'row'
  const lab = document.createElement('label')
  const name = document.createElement('span')
  const value = document.createElement('span')
  value.className = 'value'
  name.textContent = label
  lab.append(name, value)
  const input = document.createElement('input')
  input.type = 'range'
  input.min = String(min)
  input.max = String(max)
  input.step = String(step)
  input.value = String(object[key])
  const refresh = () => {
    object[key] = Number(input.value)
    value.textContent = Number(input.value).toFixed(step < 0.01 ? 3 : 2)
    onInput?.(object[key])
  }
  input.addEventListener('input', refresh)
  refresh()
  wrap.append(lab, input)
  parent.append(wrap)
  return {
    input,
    refresh() {
      if (getValue) {
        const next = Number(getValue())
        object[key] = next
        input.value = String(next)
        value.textContent = next.toFixed(step < 0.01 ? 3 : 2)
      }
    },
  }
}

function checkRow(parent, label, initial, onChange, getValue) {
  const wrap = document.createElement('div')
  wrap.className = 'row'
  const lab = document.createElement('label')
  const name = document.createElement('span')
  name.textContent = label
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.checked = initial
  input.addEventListener('change', () => onChange(input.checked))
  lab.append(name, input)
  wrap.append(lab)
  parent.append(wrap)
  return {
    input,
    refresh() {
      if (getValue) input.checked = Boolean(getValue())
    },
  }
}

function button(parent, label, onClick) {
  const b = document.createElement('button')
  b.textContent = label
  b.addEventListener('click', onClick)
  parent.append(b)
  return b
}

export function createLabPanel({
  params,
  onReset,
  onPreset,
  onModeChange,
  onPauseChange,
}) {
  const refreshers = []
  const panel = document.createElement('aside')
  panel.className = 'panel'
  panel.innerHTML = `
    <h1>U3 · Synthwave Grid</h1>
    <p>LAB: aísla fuerzas, predice y prueba. <strong>P</strong> cambia a PERFORMANCE.</p>
  `

  const sim = document.createElement('div')
  sim.className = 'group'
  sim.innerHTML = '<h2>Simulación</h2>'
  panel.append(sim)

  const state = {
    timeScale: params.timeScale.value,
    maxSpeed: params.maxSpeed.value,
    particleSize: params.particleSize.value,
    radialStrength: params.radialStrength.value,
    vortexStrength: params.vortexStrength.value,
    dragCoefficient: params.dragCoefficient.value,
    windX: params.wind.value.x,
    windY: params.wind.value.y,
    galaxyBranches: params.galaxyBranches.value,
  }

  function colorRow(parent, label, vectorUniform) {
    const wrap = document.createElement('div')
    wrap.className = 'row'
    const lab = document.createElement('label')
    const name = document.createElement('span')
    name.textContent = label

    const input = document.createElement('input')
    input.type = 'color'

    const r = Math.round(vectorUniform.value.x * 255)
      .toString(16)
      .padStart(2, '0')
    const g = Math.round(vectorUniform.value.y * 255)
      .toString(16)
      .padStart(2, '0')
    const b = Math.round(vectorUniform.value.z * 255)
      .toString(16)
      .padStart(2, '0')
    input.value = `#${r}${g}${b}`

    input.addEventListener('input', (e) => {
      const hex = e.target.value
      const rVal = parseInt(hex.slice(1, 3), 16) / 255
      const gVal = parseInt(hex.slice(3, 5), 16) / 255
      const bVal = parseInt(hex.slice(5, 7), 16) / 255
      vectorUniform.value.set(rVal, gVal, bVal)
    })

    lab.append(name, input)
    wrap.append(lab)
    parent.append(wrap)

    return {
      input,
      refresh() {},
    }
  }

  refreshers.push(
    rangeRow(
      sim,
      'timeScale',
      state,
      'timeScale',
      0,
      2,
      0.01,
      (v) => (params.timeScale.value = v),
      () => params.timeScale.value,
    ),
  )
  refreshers.push(
    rangeRow(
      sim,
      'maxSpeed',
      state,
      'maxSpeed',
      0.2,
      12,
      0.1,
      (v) => (params.maxSpeed.value = v),
      () => params.maxSpeed.value,
    ),
  )
  refreshers.push(
    rangeRow(
      sim,
      'particleSize',
      state,
      'particleSize',
      0.005,
      0.1,
      0.001,
      (v) => (params.particleSize.value = v),
      () => params.particleSize.value,
    ),
  )

  const force = document.createElement('div')
  force.className = 'group'
  force.innerHTML = '<h2>Fuerzas</h2>'
  panel.append(force)

  refreshers.push(
    checkRow(
      force,
      'Radial',
      params.radialEnabled.value > 0,
      (v) => (params.radialEnabled.value = v ? 1 : 0),
      () => params.radialEnabled.value > 0,
    ),
  )
  refreshers.push(
    rangeRow(
      force,
      'radialStrength',
      state,
      'radialStrength',
      -8,
      8,
      0.05,
      (v) => (params.radialStrength.value = v),
      () => params.radialStrength.value,
    ),
  )
  refreshers.push(
    checkRow(
      force,
      'Vórtice',
      params.vortexEnabled.value > 0,
      (v) => (params.vortexEnabled.value = v ? 1 : 0),
      () => params.vortexEnabled.value > 0,
    ),
  )
  refreshers.push(
    rangeRow(
      force,
      'vortexStrength',
      state,
      'vortexStrength',
      -8,
      8,
      0.05,
      (v) => (params.vortexStrength.value = v),
      () => params.vortexStrength.value,
    ),
  )
  refreshers.push(
    checkRow(
      force,
      'Drag',
      params.dragEnabled.value > 0,
      (v) => (params.dragEnabled.value = v ? 1 : 0),
      () => params.dragEnabled.value > 0,
    ),
  )
  refreshers.push(
    rangeRow(
      force,
      'dragCoefficient',
      state,
      'dragCoefficient',
      0,
      1,
      0.01,
      (v) => (params.dragCoefficient.value = v),
      () => params.dragCoefficient.value,
    ),
  )
  refreshers.push(
    checkRow(
      force,
      'Viento',
      params.windEnabled.value > 0,
      (v) => (params.windEnabled.value = v ? 1 : 0),
      () => params.windEnabled.value > 0,
    ),
  )
  refreshers.push(
    rangeRow(
      force,
      'wind.x',
      state,
      'windX',
      -4,
      4,
      0.05,
      (v) => (params.wind.value.x = v),
      () => params.wind.value.x,
    ),
  )
  refreshers.push(
    rangeRow(
      force,
      'wind.y',
      state,
      'windY',
      -4,
      4,
      0.05,
      (v) => (params.wind.value.y = v),
      () => params.wind.value.y,
    ),
  )
  refreshers.push(
    rangeRow(
      sim,
      'Ramas (Branches)',
      state,
      'galaxyBranches',
      2,
      10,
      1,
      (v) => {
        params.galaxyBranches.value = v
        onReset()
      },
      () => params.galaxyBranches.value,
    ),
  )

  const tests = document.createElement('div')
  tests.className = 'group'
  tests.innerHTML =
    '<h2>Pruebas de comportamiento</h2><p>Antes de pulsar una prueba, predice qué debería ocurrir.</p>'
  panel.append(tests)
  for (const [id, label] of [
    ['inertia', '1 · Inercia'],
    ['wind', '2 · Fuerza constante +X'],
    ['attract', '3 · Atracción'],
    ['repel', '4 · Repulsión'],
    ['vortex', '5 · Vórtice'],
  ])
    button(tests, label, () => onPreset(id))

  const actions = document.createElement('div')
  actions.className = 'group'
  actions.innerHTML = '<h2>Acciones</h2>'
  panel.append(actions)
  button(actions, 'Reset', onReset)
  button(actions, 'Pausar / continuar', () => onPauseChange())
  button(actions, 'LAB / PERFORMANCE', () => onModeChange())

  document.body.append(panel)

  return {
    element: panel,
    setVisible(visible) {
      panel.classList.toggle('hidden', !visible)
    },
    refresh() {
      for (const item of refreshers) item.refresh()
    },
  }
}
