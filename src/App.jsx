import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'
import './App.css'

import cube from './assets/キューブ.png'
import mimi from './assets/ミミ.png'
import mist from './assets/ミスト.png'
import rashomon from './assets/羅生門.png'
import suspiria from './assets/サスペリア.png'
import zodiac from './assets/ゾディアック.png'
import weaponHuman from './assets/武器人間.png'
import titanic from './assets/タイタニック.png'
import kokuhou from './assets/国宝.png'
import yoshizawa from './assets/吉沢亮.png'
import ryusei from './assets/横浜流星.png'
import warGame from './assets/ウォーゲーム.png'
import psychoGoreman from './assets/サイコ・ゴアマン.png'
import logo from './assets/ロゴ.png'
import menu1 from './assets/menu_1.png'
import menu2 from './assets/menu_2.png'
import menu3 from './assets/menu_3.png'
import menu4 from './assets/menu_4.png'
import syogiSound from './assets/syogi_s01.mp3'
import guideText from './assets/guide.txt?raw'

import gameScreen from './assets/game_screen.png'
import character from './assets/chracter.gif'

import gameCharacter from './assets/game_character.png'

import movies2022 from './assets/movies2022.txt?raw'
import movies2023 from './assets/movies2023.txt?raw'
import movies2024 from './assets/movies2024.txt?raw'
import movies2025 from './assets/movies2025.txt?raw'
import movies2026 from './assets/movies2026.txt?raw'
import moviesBest from './assets/BEST.txt?raw'

import welcomeMusic from './assets/Welcome.mp3'
import gameScreen from './assets/game_screen.png'

function App() {
  const [screen, setScreen] = useState('opening')
  const [guidePieceIndex, setGuidePieceIndex] = useState(0)

  const [playerPosition, setPlayerPosition] = useState({ x: 200, y: 200 })
 
const [floorPixels, setFloorPixels] = useState(null)

useEffect(() => {
  const image = new Image()
  image.src = gameScreen

  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1670
    canvas.height = 941

    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)

    setFloorPixels(ctx.getImageData(0, 0, 1670, 941).data)
  }
}, [])

const isWalkable = (x, y) => {
  if (!floorPixels) return false

  const imageWidth = 1670
  const imageHeight = 941

  // 主人公の足元を調べる
  const px = Math.round(x + 48)
  const py = Math.round(y + 120)

  if (px < 0 || px >= imageWidth || py < 0 || py >= imageHeight) {
    return false
  }

  const index = (py * imageWidth + px) * 4
  const r = floorPixels[index]
  const g = floorPixels[index + 1]
  const b = floorPixels[index + 2]

  // 木の床に近い色か判定
  return (
    r >= 140 && r <= 195 &&
    g >= 95 && g <= 150 &&
    b >= 60 && b <= 115 &&
    r > g && g > b
  )
}




  const [playerDirection, setPlayerDirection] = useState('down')
  const [playerFrame, setPlayerFrame] = useState(0)
  const moveIntervalRef = useRef(null)
  

const movePlayer = (direction) => {
  setPlayerPosition((pos) => {
  let next = { ...pos }

  if (direction === 'up') next.y -= 32
  if (direction === 'down') next.y += 32
  if (direction === 'left') next.x -= 32
  if (direction === 'right') next.x += 32

  if (!isWalkable(next.x, next.y)) return pos

  if (next.x < 0 || next.y < 0 || next.x > 1574 || next.y > 813) {
    return pos
  }

  return next
})

  setPlayerDirection(direction)
  setPlayerFrame((frame) => (frame + 1) % 3)
}


const startMoving = (direction) => {
  clearInterval(moveIntervalRef.current)
  movePlayer(direction)
  moveIntervalRef.current = setInterval(() => {
    movePlayer(direction)
  }, 180)
}

const stopMoving = () => {
  clearInterval(moveIntervalRef.current)
  moveIntervalRef.current = null
}


  useEffect(() => {
  if (screen === 'piece-guide') {
    window.scrollTo(0, 0)
  }
}, [screen])
  const guidePieces = [
  { name: 'タイタニック', image: titanic },
  { name: '国宝', image: kokuhou },
  { name: 'ミミ', image: mimi },
  { name: 'サイコ・ゴアマン', image: psychoGoreman },
  { name: 'ミスト', image: mist },
  { name: '羅生門', image: rashomon },
  { name: 'サスペリア', image: suspiria },
  { name: 'ゾディアック', image: zodiac },
  { name: '武器人間', image: weaponHuman },
  { name: 'ウォーゲーム', image: warGame },
  { name: 'CUBE', image: cube },
  { name: '吉沢亮', image: yoshizawa },
  { name: '横浜流星', image: ryusei },
]

const getGuideDescription = (pieceName) => {
  const sections = guideText.split(/\n\s*\n/)

  const section = sections.find((text) =>
    text.startsWith(`【${pieceName}】`)
  )

  return section || ''
}

const getGuideMoves = (pieceName) => {
  const moves = []

  if (pieceName === 'タイタニック' || pieceName === 'ミスト') {
    moves.push(
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    )
  }

  if (pieceName === '国宝' || pieceName === 'サイコ・ゴアマン') {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ]

    directions.forEach(([dr, dc]) => {
      for (let i = 1; i <= 2; i++) {
        moves.push([dr * i, dc * i])
      }
    })
  }

 if (pieceName === 'ミミ') {
  moves.push(
    [1, -1], [1, 0], [1, 1],
    [0, -1],          [0, 1],
    [-1, 0]
  )
}

  if (pieceName === '羅生門') {
    moves.push(
      [-1, 0],
      [-2, 0]
    )
  }

  if (pieceName === 'サスペリア') {
  moves.push(
    [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2],
    [-1, -2],                             [-1, 2],
    [0, -2],                               [0, 2],
    [1, -2],                               [1, 2],
    [2, -2],  [2, -1],  [2, 0],  [2, 1],  [2, 2]
  )
}

 if (pieceName === 'ゾディアック') {
  moves.push(
    [-1, 0],
    [0, -1],
    [0, 1],
    [-2, -2],
    [-2, 2]
  )
}

  if (pieceName === '武器人間') {
    moves.push(
      [-1, -1], [-1, 1],
      [1, -1], [1, 1]
    )
  }


  if (pieceName === 'CUBE') {
    moves.push(
      [-1, 0]
    )
  }

  if (pieceName === '吉沢亮') {
  moves.push(
    [-1, 0],
    [-2, 0],
    [1, 0],
    [2, 0],
    [0, -1],
    [0, -2],
    [0, 1],
    [0, 2]
  )
}

  if (pieceName === '横浜流星') {
  moves.push(
    [-1, -1],
    [-2, -2],
    [-1, 1],
    [-2, 2],
    [1, -1],
    [2, -2],
    [1, 1],
    [2, 2]
  )
}

  return moves
}

  const [playerSide, setPlayerSide] = useState(null)
  const [turn, setTurn] = useState('player')
  const [mistMoveCount, setMistMoveCount] = useState({
  player: 0,
  opponent: 0,
})
const [trapCube, setTrapCube] = useState(null)
const [opponentTrapCube, setOpponentTrapCube] = useState(null)
  const [result, setResult] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [onlineScreen, setOnlineScreen] = useState(false)
  useEffect(() => {
  if (screen !== 'game' || roomId) return
  if (turn !== (playerSide === 'player' ? 'opponent' : 'player')) return

 const cpuPieces = pieces.filter(
  (piece) =>
    (piece.side ?? 'player') === 'opponent'
)


 const moves = cpuPieces.flatMap((piece) =>
  getLegalMoves(
    piece,
    pieces.filter(
      (p) => !(p.name === 'ミスト' && (p.side ?? 'player') === 'player')
    )
  ).map((move) => ({
    piece,
    move,
  }))
)

const safeMoves = moves


if (safeMoves.length === 0) return

const captureMoves = safeMoves.filter(({ piece, move }) =>
  pieces.some(
    (target) =>
      target.row === move.row &&
      target.col === move.col &&
      target.name !== 'ミスト' &&
      (target.side ?? 'player') !== (piece.side ?? 'player')
  )
)

const titanMoves = safeMoves.filter(({ move }) =>
  pieces.some(
    (target) =>
      target.row === move.row &&
      target.col === move.col &&
      target.name === 'タイタニック' &&
      (target.side ?? 'player') !== 'opponent'
  )
)

const cpuMove =
  titanMoves.length > 0
    ? titanMoves[Math.floor(Math.random() * titanMoves.length)]
    : captureMoves.length > 0
      ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
      : safeMoves[Math.floor(Math.random() * safeMoves.length)]

const timer = setTimeout(() => {

  playSyogiSound()

  setPieces((currentPieces) => {

  if (cpuMove.piece.name === 'ミスト') {
  setMistMoveCount((count) => ({
  ...count,
  opponent: count.opponent + 1,
}))
}

  const capturedPiece = currentPieces.find(
    (piece) =>
      piece.row === cpuMove.move.row &&
      piece.col === cpuMove.move.col &&
      (piece.side ?? 'player') !== (cpuMove.piece.side ?? 'player')
  )

  const cpuTrapCubeCaptured =
  capturedPiece?.name === 'CUBE' &&
  capturedPiece.col === trapCube

  if (capturedPiece?.name === 'タイタニック') {
  setResult('敗北')
}

  if (capturedPiece?.name === '国宝') {
  setOpponentHand((hand) => [
    ...hand,
    { ...capturedPiece, name: '吉沢亮', image: yoshizawa },
    { ...capturedPiece, name: '横浜流星', image: ryusei },
  ])
} else if (
  cpuMove.piece.name === 'ゾディアック' &&
  capturedPiece &&
  !cpuTrapCubeCaptured
) {
  setOpponentHand((hand) => [
    ...hand,
    capturedPiece,
  ])
}

return currentPieces
  .filter((piece) =>
    piece !== capturedPiece &&
    (!cpuTrapCubeCaptured || piece !== cpuMove.piece)
  )
  .map((piece) =>
    piece === cpuMove.piece
      ? {
          ...piece,
            row: cpuMove.move.row,
            col: cpuMove.move.col,
            absorbedMoves:
            
              piece.name === '武器人間' && capturedPiece
                ? [capturedPiece.name]
                : piece.absorbedMoves,
                            ...(piece.name === 'ミミ' && cpuMove.move.row >= 6
              ? { name: 'サイコ・ゴアマン', image: psychoGoreman }
              : {}),
          }
        : piece
    )
})

setTurn(playerSide)
}, 1000)

return () => clearTimeout(timer)
}, [turn, screen, playerSide])

useEffect(() => {
  if (!roomId || screen !== 'game') return

  const channel = supabase
    .channel(`game-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'game',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
 const gameState = payload.new.game_state

if (gameState.gameEnded && gameState.winnerSide) {
  setResult(gameState.winnerSide === playerSide ? '勝利' : '敗北')
  setPieces(gameState.pieces)
  setTurn(gameState.turn)
  return
}

if (gameState.gameEnded) {
  setPieces(initialPiecesRef.current)
setPlayerHand([])
setOpponentHand([])

setResult(null)
setRoomId(null)
setScreen('opening')
  return
}

 if (
  previousTurnRef.current !== null &&
  previousTurnRef.current !== gameState.turn &&
  gameState.playerSide !== playerSide
) {
  playSyogiSound()
}

previousTurnRef.current = gameState.turn

        setPieces(gameState.pieces)
        setTurn(gameState.turn)
        setMistMoveCount(gameState.mistMoveCount ?? { player: 0, opponent: 0 })
        
        if (playerSide === 'player') {
  setPlayerHand(gameState.playerHand ?? [])
  setOpponentHand(gameState.opponentHand ?? [])
} else {
  setPlayerHand(gameState.opponentHand ?? [])
  setOpponentHand(gameState.playerHand ?? [])
}

        if (gameState.playerCount === 2) {
  setOnlineScreen(false)
}
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [roomId, screen, playerSide])

  const [selectedPiece, setSelectedPiece] = useState(null)
  const [playerHand, setPlayerHand] = useState([])
  const [opponentHand, setOpponentHand] = useState([])
  const syogiAudio = useRef(new Audio(syogiSound))

const playSyogiSound = () => {
  syogiAudio.current.currentTime = 0
  syogiAudio.current.play()
}

const previousPiecesRef = useRef(null)
const previousTurnRef = useRef(null)

  const getLegalMoves = (piece, pieces) => {
  if (!piece) return []

    if (piece.name === 'CUBE') {
    const move = {
  row: piece.row + (piece.side === 'opponent' ? 1 : -1),
  col: piece.col,
}

    if (
      move.row >= 0 &&
      !pieces.some(
        (p) =>
          p.row === move.row &&
          p.col === move.col &&
        (p.side ?? 'player') === (piece.side ?? 'player')
      )
    ) {
      return [move]
    }

    return []
  }

  if (piece.name === 'タイタニック') {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ]

    return directions
      .map(([dr, dc]) => ({
        row: piece.row + dr,
        col: piece.col + dc,
      }))
      .filter(
  (move) =>
    move.row >= 0 &&
    move.row < 9 &&
    move.col >= 0 &&
    move.col < 9 &&
    !pieces.some(
  (p) =>
    p.row === move.row &&
    p.col === move.col &&
   (p.side ?? 'player') === (piece.side ?? 'player')
)
)
  }

  if (piece.name === '国宝') {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ]

    const moves = []

    directions.forEach(([dr, dc]) => {
      let row = piece.row + dr
      let col = piece.col + dc

      while (row >= 0 && row < 9 && col >= 0 && col < 9) {
        const target = pieces.find(
          (p) => p.row === row && p.col === col
        )

        if (target) {
  if ((target.side ?? 'player') !== (piece.side ?? 'player')) {
    moves.push({ row, col })
  }
  break
}

        moves.push({ row, col })

        row += dr
        col += dc
      }
    })

    return moves
  }

    if (piece.name === '吉沢亮' || piece.name === '横浜流星') {
    const directions =
      piece.name === '吉沢亮'
        ? [[-1, 0], [1, 0], [0, -1], [0, 1]]
        : [[-1, -1], [-1, 1], [1, -1], [1, 1]]

    const moves = []

    for (const [dr, dc] of directions) {
      let row = piece.row + dr
      let col = piece.col + dc

      while (row >= 0 && row < 9 && col >= 0 && col < 9) {
        const target = pieces.find(
          (p) => p.row === row && p.col === col
        )

        if (target) {
          if (
            (target.side ?? 'player') !==
            (piece.side ?? 'player')
          ) {
            moves.push({ row, col })
          }
          break
        }

        moves.push({ row, col })
        row += dr
        col += dc
      }
    }

    return moves
  }

    if (piece.name === 'サスペリア') {
    const directions = [
      [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2],
      [-1, -2],                             [-1, 2],
      [0, -2],                               [0, 2],
      [1, -2],                               [1, 2],
      [2, -2],  [2, -1],  [2, 0],  [2, 1],  [2, 2],
    ]

    return directions
      .map(([dr, dc]) => ({
        row: piece.row + dr,
        col: piece.col + dc,
      }))
      .filter(
        (move) =>
          move.row >= 0 &&
          move.row < 9 &&
          move.col >= 0 &&
          move.col < 9 &&
          !pieces.some(
            (p) =>
              p.row === move.row &&
              p.col === move.col &&
              (p.side ?? 'player') === (piece.side ?? 'player')
          )
      )
  }
  
      if (piece.name === '羅生門') {
    let direction = piece.direction

    if (piece.row === 0) {
      direction = 1
    }

    if (piece.row === 8) {
      direction = -1
    }

    const moves = []
    let row = piece.row + direction

    while (row >= 0 && row < 9) {
      const target = pieces.find(
        (p) => p.row === row && p.col === piece.col
      )

      if (target) {
        if (
          (target.side ?? 'player') !==
          (piece.side ?? 'player')
        ) {
          moves.push({ row, col: piece.col, direction })
        }
        break
      }

      moves.push({ row, col: piece.col, direction })
      row += direction
    }

    return moves
  }

  if (piece.name === 'サイコ・ゴアマン') {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]

  const moves = []

  for (const [dr, dc] of directions) {
    let row = piece.row + dr
    let col = piece.col + dc

    while (row >= 0 && row < 9 && col >= 0 && col < 9) {
      const target = pieces.find(
        (p) => p.row === row && p.col === col
      )

      if (target) {
        if (
          (target.side ?? 'player') !==
          (piece.side ?? 'player')
        ) {
          moves.push({ row, col })
        }
        break
      }

      moves.push({ row, col })
      row += dr
      col += dc
    }
  }

  return moves
}

    if (piece.name === 'ミミ') {
    const direction = piece.side === 'opponent' ? 1 : -1

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, 0],
    ]

    return directions
      .map(([dr, dc]) => ({
        row: piece.row + dr * direction,
        col: piece.col + dc,
      }))
      .filter(
        (move) =>
          move.row >= 0 &&
          move.row < 9 &&
          move.col >= 0 &&
          move.col < 9 &&
          !pieces.some(
            (p) =>
              p.row === move.row &&
              p.col === move.col &&
              (p.side ?? 'player') === (piece.side ?? 'player')
          )
      )
  }

if (piece.name === 'ウォーゲーム') {
  const nearbyPieces = pieces.filter(
    (p) =>
      Math.abs(p.row - piece.row) <= 1 &&
      Math.abs(p.col - piece.col) <= 1 &&
      p !== piece
  )

  const side = piece.side ?? 'player'
  const direction = side === 'player' ? -1 : 1

  const abilityMoves = {}

  // 基本能力
  abilityMoves['基本'] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ]

  nearbyPieces.forEach((nearby) => {
    let moves = []

    // CUBE
    if (nearby.name === 'CUBE') {
      moves = [[direction * 2, 0]]
    }

    // 国宝
    if (nearby.name === '国宝') {
      moves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
        [-2, -2], [-2, 0], [-2, 2],
        [0, -2],           [0, 2],
        [2, -2],  [2, 0],  [2, 2],
      ]
    }

    // 羅生門
    if (nearby.name === '羅生門') {
      moves = [
        [direction, 0],
        [direction * 2, 0],
      ]
    }

    // サスペリア
    if (nearby.name === 'サスペリア') {
      moves = [
        [-2, -2], [-2, 0], [-2, 2],
        [0, -2],           [0, 2],
        [2, -2],  [2, 0],  [2, 2],
      ]
    }

    // ゾディアック
    if (nearby.name === 'ゾディアック') {
      moves = [
        [direction, 0],
        [0, -1],
        [0, 1],
      ]
    }

    // ミミ
    if (nearby.name === 'ミミ') {
      moves = [
        [direction, -1],
        [direction, 0],
        [direction, 1],
        [0, -1],
        [0, 1],
        [-direction, 0],
      ]
    }

    // ミスト
    if (nearby.name === 'ミスト') {
      moves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ]
    }

    // タイタニック
    if (nearby.name === 'タイタニック') {
      moves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ]
    }

    // サイコ・ゴアマン
    if (nearby.name === 'サイコ・ゴアマン') {
      moves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
        [-2, -2], [-2, 0], [-2, 2],
        [0, -2],           [0, 2],
        [2, -2],  [2, 0],  [2, 1],
      ]
    }

    if (moves.length > 0) {
      abilityMoves[nearby.name] = moves
    }
  })

  // 周囲にいる駒の能力だけを候補にする
  const nearbyAbilities = Object.keys(abilityMoves).filter(
    (ability) => ability !== '基本'
  )

  // 周囲に能力を持つ駒がいなければ基本能力
  const selectedAbility =
    nearbyAbilities.length > 0
      ? nearbyAbilities[
          Math.floor(Math.random() * nearbyAbilities.length)
        ]
      : '基本'

  const selectedMoves = abilityMoves[selectedAbility]

  // 選ばれた能力の合法手だけ返す
  return selectedMoves
    .map(([dr, dc]) => ({
      row: piece.row + dr,
      col: piece.col + dc,
    }))
    .filter(
      (move) =>
        move.row >= 0 &&
        move.row < 9 &&
        move.col >= 0 &&
        move.col < 9 &&
        !pieces.some(
          (p) =>
            p.row === move.row &&
            p.col === move.col &&
            (p.side ?? 'player') === side
        )
    )
}

  if (piece.name === 'ミスト') {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ]

  return directions
    .map(([dr, dc]) => ({
      row: piece.row + dr,
      col: piece.col + dc,
    }))
    .filter(
      (move) =>
        move.row >= 0 &&
        move.row < 9 &&
        move.col >= 0 &&
        move.col < 9 &&
        !pieces.some(
          (p) =>
            p.row === move.row &&
            p.col === move.col &&
            (p.side ?? 'player') === (piece.side ?? 'player')
        )
    )
}

if (piece.name === 'ゾディアック') {
  const direction = piece.side === 'opponent' ? 1 : -1

  const directions = [
  [direction, 0],
  [0, -1],
  [0, 1],
  [direction * 2, -2],
  [direction * 2, 2],
]

  return directions
    .map(([dr, dc]) => ({
      row: piece.row + dr,
      col: piece.col + dc,
    }))
    .filter(
      (move) =>
        move.row >= 0 &&
        move.row < 9 &&
        move.col >= 0 &&
        move.col < 9 &&
        !pieces.some(
          (p) =>
            p.row === move.row &&
            p.col === move.col &&
            (p.side ?? 'player') === (piece.side ?? 'player')
        )
    )
}



if (piece.name === '武器人間') {
  const absorbedMove = piece.absorbedMoves?.[0]

  if (absorbedMove === 'CUBE') {
  const direction = piece.side === 'opponent' ? 1 : -1
  const row = piece.row + direction
  const col = piece.col

  if (
    row >= 0 &&
    row < 9 &&
    !pieces.some(
      (p) =>
        p.row === row &&
        p.col === col &&
        (p.side ?? 'player') === (piece.side ?? 'player')
    )
  ) {
    return [{ row, col }]
  }

  return []
}


if (absorbedMove === 'ミミ') {
  const direction = piece.side === 'opponent' ? 1 : -1

  const moves = [
    { row: piece.row + direction, col: piece.col },
    { row: piece.row, col: piece.col - 1 },
    { row: piece.row, col: piece.col + 1 },
    { row: piece.row - direction, col: piece.col - 1 },
    { row: piece.row - direction, col: piece.col },
    { row: piece.row - direction, col: piece.col + 1 },
  ]

  return moves.filter(
    ({ row, col }) =>
      row >= 0 &&
      row < 9 &&
      col >= 0 &&
      col < 9 &&
      !pieces.some(
        (p) =>
          p.row === row &&
          p.col === col &&
          (p.side ?? 'player') === (piece.side ?? 'player')
      )
  )
}


if (absorbedMove === 'サイコ・ゴアマン') {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ]

  const moves = []

  for (const [dr, dc] of directions) {
    let row = piece.row + dr
    let col = piece.col + dc

    while (row >= 0 && row < 9 && col >= 0 && col < 9) {
      const target = pieces.find(
        (p) => p.row === row && p.col === col
      )

      if (target) {
        if (
          (target.side ?? 'player') !==
          (piece.side ?? 'player')
        ) {
          moves.push({ row, col })
        }
        break
      }

      moves.push({ row, col })
      row += dr
      col += dc
    }
  }

  return moves
}


  if (absorbedMove === 'ゾディアック') {
    const direction = piece.side === 'opponent' ? 1 : -1

    const directions = [
      [direction, 0],
      [0, -1],
      [0, 1],
      [direction * 2, -2],
      [direction * 2, 2],
    ]

    return directions
      .map(([dr, dc]) => ({
        row: piece.row + dr,
        col: piece.col + dc,
      }))
      .filter(
        (move) =>
          move.row >= 0 &&
          move.row < 9 &&
          move.col >= 0 &&
          move.col < 9 &&
          !pieces.some(
            (p) =>
              p.row === move.row &&
              p.col === move.col &&
              (p.side ?? 'player') === (piece.side ?? 'player')
          )
      )
  }


  
  if (absorbedMove === '吉沢亮') {
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ]

    const moves = []

    for (const [dr, dc] of directions) {
      let row = piece.row + dr
      let col = piece.col + dc

      while (row >= 0 && row < 9 && col >= 0 && col < 9) {
        const target = pieces.find(
          (p) => p.row === row && p.col === col
        )

        if (target) {
          if (
            (target.side ?? 'player') !==
            (piece.side ?? 'player')
          ) {
            moves.push({ row, col })
          }
          break
        }

        moves.push({ row, col })
        row += dr
        col += dc
      }
    }

    return moves
  }

  
  if (absorbedMove === '横浜流星') {
    const directions = [
      [-1, -1], [-1, 1], [1, -1], [1, 1],
    ]

    const moves = []

    for (const [dr, dc] of directions) {
      let row = piece.row + dr
      let col = piece.col + dc

      while (row >= 0 && row < 9 && col >= 0 && col < 9) {
        const target = pieces.find(
          (p) => p.row === row && p.col === col
        )

        if (target) {
          if (
            (target.side ?? 'player') !==
            (piece.side ?? 'player')
          ) {
            moves.push({ row, col })
          }
          break
        }

        moves.push({ row, col })
        row += dr
        col += dc
      }
    }

    return moves
  }



  if (absorbedMove === '羅生門') {
    const direction =
      piece.row === 0
        ? 1
        : piece.row === 8
        ? -1
        : piece.direction ?? -1

    const moves = []
    let row = piece.row + direction

    while (row >= 0 && row < 9) {
      const target = pieces.find(
        (p) => p.row === row && p.col === piece.col
      )

      if (target) {
        if (
          (target.side ?? 'player') !==
          (piece.side ?? 'player')
        ) {
          moves.push({ row, col: piece.col, direction })
        }
        break
      }

      moves.push({ row, col: piece.col, direction })
      row += direction
    }

    return moves
  }

  if (absorbedMove === '国宝') {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ]

    const moves = []

    for (const [dr, dc] of directions) {
      let row = piece.row + dr
      let col = piece.col + dc

      while (row >= 0 && row < 9 && col >= 0 && col < 9) {
        const target = pieces.find(
          (p) => p.row === row && p.col === col
        )

        if (target) {
          if (
            (target.side ?? 'player') !==
            (piece.side ?? 'player')
          ) {
            moves.push({ row, col })
          }
          break
        }

        moves.push({ row, col })
        row += dr
        col += dc
      }
    }

    return moves
  }

    if (absorbedMove === 'サスペリア') {
    const moves = []

    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        if (
          Math.abs(dr) === 2 ||
          Math.abs(dc) === 2
        ) {
          const row = piece.row + dr
          const col = piece.col + dc

          if (
            row >= 0 &&
            row < 9 &&
            col >= 0 &&
            col < 9 &&
            !pieces.some(
              (p) =>
                p.row === row &&
                p.col === col &&
                (p.side ?? 'player') ===
                  (piece.side ?? 'player')
            )
          ) {
            moves.push({ row, col })
          }
        }
      }
    }

    return moves
  }

  const directions = [
    [-1, -1], [-1, 1],
    [1, -1],  [1, 1],
    ...(absorbedMove === 'ミスト'
      ? [
          [-1, 0], [1, 0],
          [0, -1], [0, 1],
        ]
      : []),
  ]

  return directions
    .map(([dr, dc]) => ({
      row: piece.row + dr,
      col: piece.col + dc,
    }))
    .filter(
      (move) =>
        move.row >= 0 &&
        move.row < 9 &&
        move.col >= 0 &&
        move.col < 9 &&
        !pieces.some(
          (p) =>
            p.row === move.row &&
            p.col === move.col &&
(
  (p.side ?? 'player') === (piece.side ?? 'player')
)
        )
    )
}

  return []
}
  
  const [pieces, setPieces] = useState([
  { name: 'ミスト', image: mist, row: 8, col: 0 },
  { name: '羅生門', image: rashomon, row: 8, col: 1, direction: -1 },

  { name: 'ウォーゲーム', image: warGame, row: 8, col: 2 },
  { name: '武器人間', image: weaponHuman, row: 8, col: 3, absorbedMoves: [] },
  { name: 'タイタニック', image: titanic, row: 8, col: 4, side: 'player' },
  { name: '国宝', image: kokuhou, row: 8, col: 5 },
  { name: 'ウォーゲーム', image: warGame, row: 8, col: 6 },
  { name: 'サスペリア', image: suspiria, row: 8, col: 7 },
  { name: 'ゾディアック', image: zodiac, row: 8, col: 8 },

  { name: 'ミミ', image: mimi, row: 7, col: 4, side: 'player' },

  { name: 'CUBE', image: cube, row: 6, col: 0 },
  { name: 'CUBE', image: cube, row: 6, col: 1 },
  { name: 'CUBE', image: cube, row: 6, col: 2 },
  { name: 'CUBE', image: cube, row: 6, col: 3 },
  { name: 'CUBE', image: cube, row: 6, col: 4 },
  { name: 'CUBE', image: cube, row: 6, col: 5 },
  { name: 'CUBE', image: cube, row: 6, col: 6 },
  { name: 'CUBE', image: cube, row: 6, col: 7 },
  { name: 'CUBE', image: cube, row: 6, col: 8 },
    { name: 'ミスト', image: mist, row: 0, col: 0, side: 'opponent' },
  { name: '羅生門', image: rashomon, row: 0, col: 1, side: 'opponent', direction: 1 },
  { name: 'ウォーゲーム', image: warGame, row: 0, col: 2, side: 'opponent' },
  { name: '武器人間', image: weaponHuman, row: 0, col: 3, side: 'opponent', absorbedMoves: [] },
  { name: 'タイタニック', image: titanic, row: 0, col: 4, side: 'opponent' },
  { name: '国宝', image: kokuhou, row: 0, col: 5, side: 'opponent' },
  { name: 'ウォーゲーム', image: warGame, row: 0, col: 6, side: 'opponent' },
  { name: 'サスペリア', image: suspiria, row: 0, col: 7, side: 'opponent' },
  { name: 'ゾディアック', image: zodiac, row: 0, col: 8, side: 'opponent' },

  { name: 'ミミ', image: mimi, row: 1, col: 4, side: 'opponent' },

  { name: 'CUBE', image: cube, row: 2, col: 0, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 1, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 2, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 3, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 4, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 5, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 6, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 7, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 8, side: 'opponent' },
])

const [showMovieNotes, setShowMovieNotes] = useState(false)
const [showWhiteWhale, setShowWhiteWhale] = useState(false)
const [showBestMovies, setShowBestMovies] = useState(false)
const [bestMovieDetails, setBestMovieDetails] = useState([])

useEffect(() => {
  if (!showBestMovies || bestMovieDetails.length > 0) return

  let cancelled = false

  const loadBestMovies = async () => {
    const details = await Promise.all(
      bestMovies.map(async (title) => {
        try {
const searchTitle =
  bestMovieSearchTitles[title.trim()] || title.trim()

const response = await fetch(
  `/api/tmdb?query=${encodeURIComponent(searchTitle)}`
)
          const data = await response.json()
          const normalizedTitle = searchTitle.trim().toLowerCase()

const movie =
  data.results?.find(item =>
    item.title?.trim().toLowerCase() === normalizedTitle ||
    item.original_title?.trim().toLowerCase() === normalizedTitle
  ) || data.results?.[0]

          return {
            name: title.trim(),
            posterPath: movie?.poster_path || null,
            releaseDate: movie?.release_date || '',
            tmdbTitle: movie?.title || '',
            id: movie?.id || null,
          }
        } catch {
          return {
            name: title.trim(),
            posterPath: null,
            releaseDate: '',
            tmdbTitle: '',
            id: null,
          }
        }
      })
    )

    if (!cancelled) {
      setBestMovieDetails(details)
    }
  }

  loadBestMovies()

  return () => {
    cancelled = true
  }
}, [showBestMovies, bestMovieDetails.length])


const [selectedMovieYear, setSelectedMovieYear] = useState(2022)


const movieNotesByYear = {
  2022: movies2022,
  2023: movies2023,
  2024: movies2024,
  2025: movies2025,
  2026: movies2026,
}

const bestMovies = moviesBest.split('\n').filter(line => line.trim())
const bestMovieSearchTitles = {
  'オールド': 'Old',
  'バニラスカイ': 'Vanilla Sky',
  'パール': 'Pearl',
  'エクスマキナ': 'Ex Machina',
  '去年の冬、君と別れ': 'Last Winter, We Parted',
  'パーティーで女の子に話しかけるには': 'How to Talk to Girls at Parties',
  'きっとうまく行く': '3 Idiots',
  'グッドウィルハンティング': 'Good Will Hunting',
  '最強の二人': 'Intouchables',
  'パンズラビリンス': "Pan's Labyrinth",
  'ガールズインザベースメント': 'Girl in the Basement',
  'キューブ': 'Cube',
  'ゴーンガール': 'Gone Girl',
  'ミッドナイトエクスプレス': 'Midnight Express',
  'エスターファーストキル': 'Orphan: First Kill',
  'まったく同じ3人の他人': 'Three Identical Strangers',
  'ソルトバーン': 'Saltburn',
}


const initialPiecesRef = useRef(null)

if (initialPiecesRef.current === null) {
  initialPiecesRef.current = pieces
}

const createRoom = async () => {
  const newRoomId = Math.floor(100000 + Math.random() * 900000).toString()

const newTrapCube = Math.floor(Math.random() * 9)
const newOpponentTrapCube = Math.floor(Math.random() * 9)

  const { error } = await supabase
    .from('game')
    .insert({
      room_id: newRoomId,
      game_state: {
  pieces,
  turn: 'player',
  playerSide: 'player',
  playerCount: 1,
  trapCube: newTrapCube,
  opponentTrapCube: newOpponentTrapCube,
  playerHand: [],
opponentHand: [],
mistMoveCount: {
  player: 0,
  opponent: 0,
},
},
    })

  if (error) {
    alert(error.message)
    return
  }
  setTrapCube(newTrapCube)
  setOpponentTrapCube(newOpponentTrapCube)
  setRoomId(newRoomId)
  setPlayerSide('player')
  setScreen('game')
}

const joinRoom = async () => {
  if (!roomId) {
    alert('ルームIDを入力してください')
    return
  }

  const { data, error } = await supabase
  .from('game')
  .select('game_state')
  .eq('room_id', roomId)
  .limit(1)

  if (error || !data) {
  alert(error?.message || 'ルームが見つかりません')
  return
}

await supabase
  .from('game')
  .update({
    game_state: {
      ...data[0].game_state,
      playerCount: 2,
    },
  })
  .eq('room_id', roomId)

  setOnlineScreen(false)

  setPieces(data[0].game_state.pieces)
setTurn(data[0].game_state.turn)
setPlayerHand(data[0].game_state.opponentHand ?? [])
setTrapCube(data[0].game_state.opponentTrapCube)
setOpponentTrapCube(data[0].game_state.trapCube)
setOpponentHand(data[0].game_state.playerHand ?? [])
setPlayerSide('opponent')
setScreen('game')
}

const updateGameState = async (
  nextPieces,
  nextTurn,
  nextPlayerHand,
  nextMistMoveCount,
  gameEnded = false,
  winnerSide = null
) => {
  if (!roomId) return

  const { data } = await supabase
    .from('game')
    .select('game_state')
    .eq('room_id', roomId)
    .single()

  if (!data) return

  const currentState = data.game_state
  if (currentState.turn !== turn) return

  await supabase
    .from('game')
    .update({
      game_state: {
        pieces: nextPieces,
        turn: nextTurn,
        mistMoveCount: nextMistMoveCount,
        trapCube: currentState.trapCube,
        opponentTrapCube: currentState.opponentTrapCube,
        gameEnded,
        winnerSide,
        playerSide,
        playerHand:
          playerSide === 'player'
            ? nextPlayerHand
            : currentState.playerHand ?? [],
        opponentHand:
          playerSide === 'opponent'
            ? nextPlayerHand
            : currentState.opponentHand ?? [],
      },
    })
    .eq('room_id', roomId)
}

  return (
  <>

   <audio src={welcomeMusic} preload="auto" />

{result && (
  <div className="result-message">
    {result}
  </div>
)}

    {screen === 'opening' && (
  <div className="opening">
    <img src={logo} alt="映画将棋" />

    <div className="menu-buttons">
      <img src={menu1} alt="メニュー1" onClick={() => setScreen('turn-select')} />
      <img
        src={menu2}
        alt="メニュー2"
        onClick={() => {
  setOnlineScreen(true)
  setScreen('online')
}}
/>
      <img
  src={menu3}
  alt="メニュー3"
  onClick={() => setScreen('piece-guide')}
/>
    </div>

      <img
  src={menu4}
  alt="メニュー4"
  onClick={() => {
  setScreen('rental-shop')
  window.scrollTo(0, 0)
}}
/>

  </div>
)}

{screen === 'piece-guide' && (
  <div className="piece-guide">
    {guidePieces.map((piece) => (
      <div className="guide-piece" key={piece.name}>
        <h2>{piece.name}</h2>

        <div className="guide-board">
          {Array.from({ length: 25 }).map((_, index) => (
            <div
              className={`guide-cell ${
                piece.name !== 'ウォーゲーム' &&
  getGuideMoves(piece.name).some(
    (move) =>
      move[0] === Math.floor(index / 5) - 2 &&
      move[1] === index % 5 - 2
  )
    ? 'guide-move'
    : ''
              }`}
              key={index}
            >
              {index === 12 && (
                <img
                  src={piece.image}
                  alt={piece.name}
                />
              )}
            </div>
          ))}
        </div>

        <p>{getGuideDescription(piece.name)}</p>
      </div>
    ))}

    <button onClick={() => setScreen('opening')}>
      戻る
    </button>
  </div>
)}


{screen === 'rental-shop' && (
  
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: '#000',
    }}
  >

        <audio src={welcomeMusic} autoPlay loop preload="auto" />

<div
  style={{
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: 9999,
    color: 'white',
    background: 'black',
    padding: '8px',
  }}
>
  x: {playerPosition.x}, y: {playerPosition.y}
</div>
<div
  style={{
    position: 'absolute',
    left: `${Math.min(0, Math.max(window.innerWidth - 1670 * 0.8, 160 - playerPosition.x * 0.8))}px`,
    top: `${Math.min(0, Math.max(window.innerHeight - 941 * 0.8, 200 - playerPosition.y * 0.8))}px`,
    transform: 'scale(0.8)',
    transformOrigin: 'top left',
  }}
>


    <img
      src={gameScreen}
      alt="店内マップ"hayakuy
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        maxWidth: 'none',
        maxHeight: 'none',
      }}
    />

          <div
      style={{
        position: 'absolute',
        left: `${playerPosition.x}px`,
        top: `${playerPosition.y}px`,
        width: '96px',
        height: '128px',
        overflow: 'hidden',
        zIndex: 2,
      }}
    >
      <img
        src={gameCharacter}
        alt="主人公"
        style={{
          position: 'absolute',
          left: `${-playerFrame * 128 - 194}px`,
          top:
  playerDirection === 'down'
    ? '0px'
    : playerDirection === 'up'
    ? '-128px'
    : playerDirection === 'left'
    ? '-256px'
    : '-384px',
          width: '768px',
          height: '512px',
          maxWidth: 'none',
          imageRendering: 'pixelated',
        }}
      />
    </div>

    </div>

    <div
      style={{
        position: 'absolute',
        top: '0px',
        right: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '180px',
          minHeight: '80px',
          padding: '12px',
          background: 'white',
          border: '3px solid black',
          borderRadius: '8px',
          color: 'black',
        }}
      >
        いらっしゃい！
      </div>

      <img
        src={character}
        alt="店員"
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'cover',
          border: '3px solid black',
          imageRendering: 'pixelated',
        }}
      />
    </div>
    

    <div className="shop-controls">
  <div className="shop-dpad">
    


<button
  className="dpad-up"
  style={{ touchAction: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
  onPointerDown={(e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    startMoving('up')
  }}
  onPointerUp={stopMoving}
  onPointerCancel={stopMoving}
  onContextMenu={(e) => e.preventDefault()}
>
  ▲
</button>

<button
  className="dpad-left"
  style={{ touchAction: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
  onPointerDown={(e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    startMoving('left')
  }}
  onPointerUp={stopMoving}
  onPointerCancel={stopMoving}
  onContextMenu={(e) => e.preventDefault()}
>
  ◀
</button>

<button
  className="dpad-right"
  style={{ touchAction: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
  onPointerDown={(e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    startMoving('right')
  }}
  onPointerUp={stopMoving}
  onPointerCancel={stopMoving}
  onContextMenu={(e) => e.preventDefault()}
>
  ▶
</button>

<button
  className="dpad-down"
  style={{ touchAction: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
  onPointerDown={(e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    startMoving('down')
  }}
  onPointerUp={stopMoving}
  onPointerCancel={stopMoving}
  onContextMenu={(e) => e.preventDefault()}
>
  ▼
</button>

  </div>
</div>

<div className="shop-action-buttons">
  <button
  className="shop-button button-a"
  onClick={() => {
  const x = playerPosition.x
  const y = playerPosition.y

  if (x >= 0 && x <= 80 && y >= 190 && y <= 280) {
  setShowMovieNotes(true)
}

if (x >= 420 && x <= 490 && y >= 170 && y <= 230) {
  setShowWhiteWhale(true)
}
}}
>
  A
</button>
  <button className="shop-button button-b">B</button>
</div>
{showMovieNotes && (
  <>
  <div style={{ position: 'absolute', inset: 0, zIndex: 11, pointerEvents: 'none' }}>
    <button
      onClick={() => {
        setShowMovieNotes(false)
        setShowBestMovies(false)
      }}
      style={{
        position: 'absolute',
        top: '5%',
        right: '5%',
        pointerEvents: 'auto',
        background: 'black',
        color: 'white',
        border: '1px solid white',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
height: '32px',
minWidth: '32px',
minHeight: '32px',
padding: 0,
boxSizing: 'border-box',
aspectRatio: '1 / 1',
        fontSize: '20px',
        cursor: 'pointer',
        
      }}
    >
      ×
    </button>
  </div>
  <div
    style={{
      position: 'absolute',
      inset: '10%',
      zIndex: 10,
      background: 'black',
color: 'white',
border: '2px solid white',
borderRadius: '8px',
      padding: '16px',
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
    }}
  >
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
  <button
    onClick={() => {
      setShowBestMovies(false)
      setShowMovieNotes(true)
    }}
    style={{
      flex: 1,
      padding: '8px',
      background: showBestMovies ? 'black' : '#333',
      color: 'white',
      border: '1px solid white',
      borderRadius: '6px',
    }}
  >
    映画ノート
  </button>

  <button
    onClick={() => setShowBestMovies(true)}
    style={{
      flex: 1,
      padding: '8px',
      background: showBestMovies ? '#333' : 'black',
      color: 'white',
      border: '1px solid white',
      borderRadius: '6px',
    }}
  >
    BEST
  </button>
</div>

{!showBestMovies && (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px', marginBottom: '16px' }}>
    {[2022, 2023, 2024, 2025, 2026].map((year) => (
      <button
        key={year}
        onClick={() => setSelectedMovieYear(year)}
        style={{
          padding: '8px',
          whiteSpace: 'nowrap',
          background: 'black',
          color: 'white',
          border: selectedMovieYear === year ? '2px solid white' : '1px solid #777',
          borderRadius: '6px',
        }}
      >
        {year}年
      </button>
    ))}
  </div>
)}

{!showBestMovies && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
  {movieNotesByYear[selectedMovieYear].split('\n').filter(line => line.trim()).map((line, index) => {
    const match = line.trim().match(/^(.*?)\s+(\d+点|👼(?:×\d+)?)(?:\s+\[(.*?)\]\s+(\d{4})年)?$/)

    if (!match) return <div key={index}>{line}</div>


    return (
      <div
        key={index}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid #555',
          padding: '6px 0',
        }}
      >
<div style={{ flex: 1, minWidth: 0 }}>
  <div style={{ overflowWrap: 'anywhere' }}>{match[1]}</div>
  {selectedMovieYear === 2026 && match[3] && (
    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '3px' }}>
      {match[3]} ・ {match[4]}年
    </div>
  )}
</div>
<span style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>{match[2]}</span>
      </div>
    )
  })}
</div>)}

{showBestMovies && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    
{bestMovieDetails.map((movie, index) => (
  <div
    key={index}
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      borderBottom: '1px solid #555',
      padding: '8px 0',
      color: 'white',
    }}
  >
    {movie.posterPath ? (
      <img
        src={`https://image.tmdb.org/t/p/w185${movie.posterPath}`}
        alt={`${movie.name}のポスター`}
        style={{
          width: '90px',
          flexShrink: 0,
          objectFit: 'contain',
        }}
      />
    ) : (
      <div
        style={{
          width: '90px',
          height: '135px',
          flexShrink: 0,
          background: '#333',
        }}
      />
    )}

    <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
      <div>{movie.name}</div>
      {movie.releaseDate && (
        <div style={{ fontSize: '12px', color: '#aaa', marginTop: '6px' }}>
          {movie.releaseDate.slice(0, 4)}年
        </div>
      )}
    </div>
  </div>
))}

  </div>
)}
  
   
  </div>
  </>
)}
  </div>
)}

{showWhiteWhale && (
  <div
    style={{
      position: 'absolute',
      inset: '10%',
      zIndex: 20,
      background: 'black',
      color: 'white',
      border: '2px solid white',
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    }}
  >
    <img
      src={whiteWhaleVHS}
      alt="白鯨 VHS"
      style={{
        maxWidth: '180px',
        maxHeight: '220px',
        objectFit: 'contain',
      }}
    />

    <h2>白鯨</h2>

    <p>特殊能力：鯨隠（げいいん）</p>

    <p>前方と左右斜め前に進める。潜水して駒と重なることができる。</p>

    <button onClick={() => setShowWhiteWhale(false)}>
      戻る
    </button>
  </div>
)}

{onlineScreen && (
  <div className="turn-select">
    <button onClick={createRoom}>ルームを作る</button>
    <input
      type="number"
      placeholder="ルームID"
      value={roomId ?? ''}
      onChange={(e) => setRoomId(e.target.value)}
    />
    <button onClick={joinRoom}>ルームに入る</button>
  </div>
)}



{screen === 'turn-select' && (
  <div className="turn-select">
    <button onClick={() => {
      setPieces(initialPiecesRef.current)
setPlayerHand([])
setOpponentHand([])
setPlayerSide('player')
  setTrapCube(Math.floor(Math.random() * 9))
  setOpponentTrapCube(Math.floor(Math.random() * 9))
  setTurn('player')
  setRoomId(null)
  setScreen('game')
}}>先手</button>
  
    <button onClick={() => {
      setPieces(initialPiecesRef.current)
setPlayerHand([])
setOpponentHand([])
setPlayerSide('player')
  setTrapCube(Math.floor(Math.random() * 9))
  setOpponentTrapCube(Math.floor(Math.random() * 9))
  setTurn('opponent')
  setScreen('game')
}}>後手</button>
  </div>
)}

    {screen === 'game' && (
      <div className="game">
        {roomId && <div>ルームID: {roomId}</div>}

        <div>M: 0</div>

<button className="home-button" onClick={async () => {
  if (roomId) {
    const { data } = await supabase
      .from('game')
      .select('game_state')
      .eq('room_id', roomId)
      .single()

    if (data) {
      await supabase
        .from('game')
        .update({
          game_state: {
            ...data.game_state,
            gameEnded: true,
          },
        })
        .eq('room_id', roomId)
    }
  }

  setPieces(initialPiecesRef.current)
  setResult(null)
  setRoomId(null)
  setScreen('opening')
}}>戻る</button>

      <div className="hand-box opponent-hand-box">
  {opponentHand.map((piece, index) => (
    <img
      key={index}
      className="hand-piece opponent-hand-piece"
      src={piece.image}
      alt={piece.name}
    />
  ))}
</div>

      <div className={`board ${playerSide === 'opponent' ? 'opponent-board' : ''}`}>
        {Array.from({ length: 81 }, (_, index) => {
          const row = Math.floor(index / 9)
          const col = index % 9

          const piece = pieces.find(
            (piece) => piece.row === row && piece.col === col
          )

          const legalMoves = selectedPiece?.fromHand
  ? Array.from({ length: 81 }, (_, index) => ({
      row: Math.floor(index / 9),
      col: index % 9,
    })).filter(
      (move) =>
        !pieces.some(
          (p) => p.row === move.row && p.col === move.col
        )
    )
  : getLegalMoves(selectedPiece, pieces)

          return (
            <div
  className={`square ${
legalMoves.some((move) =>
  move.row === row &&
  move.col === col
) 

      ? 'legal-move'
      : ''
  }`}
  key={index}
  onClick={() => {
  if (screen !== 'game') return
  
  if (selectedPiece?.fromHand) {
    if (turn !== playerSide) return
    if (piece) return

    if (!playerHand.some(
  (handPiece, index) =>
    index === selectedPiece.handIndex &&
    handPiece.name === selectedPiece.name
)) return

    playSyogiSound()

    const nextPieces = [
  ...pieces,
  {
    ...selectedPiece,
    row,
    col,
    side: playerSide,
    fromHand: undefined,
    handIndex: undefined,
  },
]

const nextPlayerHand = playerHand.filter(
  (_, index) => index !== selectedPiece.handIndex
)

setPieces(nextPieces)
setPlayerHand(nextPlayerHand)

const nextTurn = turn === 'player' ? 'opponent' : 'player'
updateGameState(
  nextPieces,
  nextTurn,
  nextPlayerHand ?? playerHand,
  {
    ...mistMoveCount,
    [playerSide]: mistMoveCount[playerSide] + (
      selectedPiece?.name === 'ミスト' ? 1 : 0
    ),
  },
  false,
  null
)

    setSelectedPiece(null)

if (!roomId) {
  setTurn(nextTurn)
}

return
  }

 

  if (
  legalMoves.some((move) => move.row === row && move.col === col)
) {
    playSyogiSound()

 if (selectedPiece?.name === 'ミスト' && selectedPiece?.side !== 'opponent') {
  setMistMoveCount((count) => ({
    ...count,
    [playerSide]: count[playerSide] + 1,
  }))
}

const trapCubeCaptured =
  pieces.find(
    (p) =>
      p.name === 'CUBE' &&
      p.row === row &&
      p.col === col &&
      (
  (p.side === playerSide && p.col === trapCube) ||
  (p.side !== playerSide && p.col === opponentTrapCube)
) &&
      (p.side ?? 'player') !== (selectedPiece?.side ?? 'player')
  )

  const capturedPieces = pieces.filter((p) => {
 


 

  return (
    p.row === row &&
    p.col === col &&
    (p.side ?? 'player') !== (selectedPiece.side ?? 'player')
  )
})

if (capturedPieces.some((captured) => captured.name === 'タイタニック')) {
  setResult('勝利')
}
  
let nextPlayerHand = playerHand

if (selectedPiece?.name === 'ゾディアック') {
  const newHand = capturedPieces.flatMap((captured) =>
  captured.name === '国宝' || captured === trapCubeCaptured
    ? []
    : [captured]
)

  nextPlayerHand = [...playerHand, ...newHand]
  setPlayerHand(nextPlayerHand)
}

if (capturedPieces.some((captured) => captured.name === '国宝')) {
  const kokuhou = capturedPieces.find((captured) => captured.name === '国宝')

  nextPlayerHand = [
    ...nextPlayerHand,
    { ...kokuhou, name: '吉沢亮', image: yoshizawa },
    { ...kokuhou, name: '横浜流星', image: ryusei },
  ]

  setPlayerHand(nextPlayerHand)
}

const nextPieces = pieces
  .filter(
    (p) =>
      !capturedPieces.includes(p) &&
      p !== trapCubeCaptured &&
      !(trapCubeCaptured && p === selectedPiece)
  )
  .map((p) =>
    p.row === selectedPiece.row && p.col === selectedPiece.col
      ? {
          ...p,
          row,
          col,
          direction: selectedPiece.direction,
          absorbedMoves:
            p.name === '武器人間' && capturedPieces.length > 0
              ? [capturedPieces[0].name]
              : p.absorbedMoves,
          ...(p.name === 'ミミ' && (
            (p.side === 'player' && row <= 2) ||
            (p.side === 'opponent' && row >= 6)
          )
            ? { name: 'サイコ・ゴアマン', image: psychoGoreman }
            : {})
        }
      : p
  )

setPieces(nextPieces)

const nextTurn = turn === 'player' ? 'opponent' : 'player'
updateGameState(
  nextPieces,
  nextTurn,
  nextPlayerHand ?? playerHand,
  {
    ...mistMoveCount,
    [playerSide]: mistMoveCount[playerSide] + (
      selectedPiece?.name === 'ミスト' ? 1 : 0
    ),
  },
  capturedPieces.some((captured) => captured.name === 'タイタニック'),
  capturedPieces.some((captured) => captured.name === 'タイタニック')
    ? playerSide
    : null
)

setSelectedPiece(null)

if (!roomId) {
  setTurn(turn === 'player' ? 'opponent' : 'player')
}
  }
}}

>

  
              {piece && !(piece.name === 'ミスト' &&
  (piece.side ?? 'player') !== playerSide &&
  mistMoveCount[piece.side ?? 'player'] < 10) && (
  <img
  className={`${'piece-image'} ${piece.name === 'ウォーゲーム' ? 'war-game-piece' : ''} ${piece.side === 'opponent' ? 'opponent-piece' : ''} ${!selectedPiece?.fromHand && selectedPiece?.row === piece.row && selectedPiece?.col === piece.col ? 'selected' : ''} ${piece.name === 'CUBE' &&
(
  (playerSide === 'player' && piece.side !== 'opponent' && piece.col === trapCube) ||
  (playerSide === 'opponent' && piece.side === 'opponent' && piece.col === trapCube)
) ? 'trap-cube' : ''}`}
  src={piece.image}
  alt={piece.name}
  onClick={(e) => {
    if (result) return
  if (screen !== 'game') return
  if ((piece.side ?? 'player') !== playerSide) return
  if ((piece.side ?? 'player') !== turn) return

  setSelectedPiece(piece)
}}
/>
)}


            </div>
          )
        })}
      </div>

           

            <div className="hand-box">
  {playerHand.map((piece, index) => (
    <img
  key={index}
  className="hand-piece"
  src={piece.image}
  alt={piece.name}
  onClick={() => {
  if (turn !== playerSide) return
  setSelectedPiece({ ...piece, fromHand: true, handIndex: index })
}}
/>
  ))}
</div>
          </div>



    )}
  </>
  )
}

export default App