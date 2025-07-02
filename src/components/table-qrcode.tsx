'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { getTableLink } from '@/lib/utils'

export default function TableQRCode({ token, tableNumber }: { token: string; tableNumber: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const url = getTableLink({ token, tableNumber })

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, { width: 150 }, function (error) {
        if (error) console.error('QR code error:', error)
      })
    }
  }, [token, tableNumber])

  return (
    <div className='bg-white rounded shadow inline-block'>
      <canvas ref={canvasRef} />
    </div>
  )
}
