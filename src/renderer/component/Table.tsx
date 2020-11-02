import React, {useEffect, useRef, useState} from 'react'
import './Table.css'

export interface TableProps {
  header?: (string | React.ReactNode)[]
  selectable?: boolean
}

export const Table: React.FC<TableProps> = props => {
  const [widthList, setWidthList] = useState(props.header?.map((item, i) => (i === 0 ? 500 : 120)))
  const [distanceList, setDistanceList] = useState(props.header?.map(() => 0))

  const setDistance = (dist, index) => {
    setDistanceList(prevState => prevState?.map((item, i) => (i === index ? dist : item)))
  }
  const setWidth = (width, index) => {
    setWidthList(prevState => prevState.map((item, i) => (i === index ? width : item)))
  }

  return (
    <table className={`Table ${props.selectable ? 'selectable' : ''}`} cellSpacing={0}>
      {props.header && (
        <thead>
          <tr>
            {props.header.map((item, i) => (
              <th key={i} style={{width: widthList[i] + distanceList[i]}}>
                {item}
                <Split
                  onChange={distance => {
                    setDistance(distance, i)
                  }}
                  onFinish={distance => {
                    setWidth(widthList[i] + distance, i)
                    setDistance(0, i)
                  }}
                />
              </th>
            ))}
            <th />
          </tr>
        </thead>
      )}
      <tbody>{props.children}</tbody>
    </table>
  )
}

export interface SplitProps {
  onChange?: (distance: number) => void
  onFinish?: (distance: number) => void
}

export const Split: React.FC<SplitProps> = props => {
  const [isFocus, setIsFocus] = useState(false)
  const startX = useRef(0)

  useEffect(() => {
    const onMove = (ev: MouseEvent) => {
      props.onChange?.(ev.clientX - startX.current)
    }
    const onMouseup = (ev: MouseEvent) => {
      props.onFinish?.(ev.clientX - startX.current)
      setIsFocus(false)
    }
    if (isFocus) {
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onMouseup)
    }
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onMouseup)
    }
  }, [isFocus])

  return (
    <div
      className='split'
      onMouseDown={event => {
        // clientX
        startX.current = event.clientX
        setIsFocus(true)
      }}
    />
  )
}
