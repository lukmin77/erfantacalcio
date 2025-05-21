'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Alert,
  Snackbar,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material'
import { api } from '~/utils/api'
import { HourglassTop, Save } from '@mui/icons-material'

export type magliaType = {
  mainColor: string
  secondaryColor: string
  thirdColor: string
  textColor: string
  shirtNumber: number
  selectedTemplate: string
}

const shirtCollections = [
  'solid',
  'stripes',
  'centerLine',
  'bicolor',
  'ajax',
  'sampdoria',
  'diagonal',
  'inter',
  'celtic',
  'roma',
  'america',
  'palmeiras',
  'germany',
  'veneziaFC',
  'manUnited',
  'manCity',
  'chelsea',
  'juventus',
  'lazio',
  'barcelona',
  'milan',
  'tottenham',
] as const
export type ShirtTemplate = (typeof shirtCollections)[number]

export const JerseySVG = ({
  template,
  mainColor,
  secondaryColor,
  thirdColor,
  textColor = 'black',
  size = 200,
  number = 10,
}: {
  template: ShirtTemplate
  mainColor: string
  secondaryColor: string
  thirdColor: string
  textColor: string
  size?: number
  number?: number
}) => {
  const collar = <rect x="90" y="35" width="20" height="10" fill="white" />

  switch (template) {
    case 'solid':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche senza arrotondamenti */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />
            {/* corpo con arrotondamento solo in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            {collar}
          </g>
          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'stripes':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            {/* stripes */}
            {[60, 80, 100, 120, 140].map((x) => (
              <rect
                key={x}
                x={x}
                y="40"
                width="10"
                height="110"
                fill={secondaryColor}
              />
            ))}
            {collar}
          </g>
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'centerLine':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            {/* center stripe */}
            <rect x="95" y="40" width="10" height="120" fill={secondaryColor} />
            {collar}
          </g>
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'bicolor':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            <rect x="20" y="40" width="30" height="40" fill={mainColor} />
            <rect x="150" y="40" width="30" height="40" fill={secondaryColor} />

            {/* left half with bottom-left rounded corner */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />

            {/* right half with bottom-right rounded corner */}
            <path
              d="M100 40 H150 V140 Q150 150 140 150 H100 Z"
              fill={secondaryColor}
            />
            {collar}
          </g>
          <text
            x="140"
            y="145"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'ajax':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche bianche o secondarie */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* corpo con due fasce laterali bianche e centrale rossa */}
            {/* sinistra - bianca */}
            <path
              d="M50 40 H80 V160 H60 Q50 160 50 150 Z"
              fill={secondaryColor}
            />

            {/* centro - rossa */}
            <path d="M80 40 H120 V160 H80 Z" fill={mainColor} />

            {/* destra - bianca */}
            <path
              d="M120 40 H150 V150 Q150 160 140 160 H120 Z"
              fill={secondaryColor}
            />
            {collar}
          </g>
          {/* numero */}
          <text
            x="145"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'sampdoria':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* Maniche con mainColor */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* Corpo con arrotondamento solo in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />

            {/* Bande orizzontali centrali sulle maniche */}
            <rect x="20" y="60" width="30" height="8" fill={secondaryColor} />
            <rect x="20" y="68" width="30" height="8" fill={thirdColor} />
            <rect x="20" y="76" width="30" height="8" fill={secondaryColor} />

            <rect x="150" y="60" width="30" height="8" fill={secondaryColor} />
            <rect x="150" y="68" width="30" height="8" fill={thirdColor} />
            <rect x="150" y="76" width="30" height="8" fill={secondaryColor} />

            {/* Colletto semplice */}
            {collar}
          </g>
          {/* Numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="middle"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'diagonal':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche senza arrotondamenti */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* corpo con arrotondamento solo in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />

            {/* fascia diagonale */}
            <path
              d="M50 45 L70 40 L150 145 L130 150 Z"
              fill={secondaryColor}
              stroke="none"
            />

            {collar}
          </g>

          {/* numero */}
          <text
            x="70"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'inter':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche senza arrotondamenti */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* corpo con arrotondamento solo in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />

            {/* bande zig-zag */}
            {Array.from({ length: 5 }).map((_, i) => {
              const yStart = 40 + i * 20
              const zigzag = `
            M55 ${yStart}
            L75 ${yStart + 10}
            L95 ${yStart}
            L115 ${yStart + 10}
            L135 ${yStart}
            L145 ${yStart + 10}
            L145 ${yStart + 20}
            L135 ${yStart + 10}
            L115 ${yStart + 20}
            L95 ${yStart + 10}
            L75 ${yStart + 20}
            L55 ${yStart + 10}
            Z
          `
              return (
                <path key={i} d={zigzag} fill={secondaryColor} stroke="none" />
              )
            })}

            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'celtic':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche senza arrotondamenti */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* corpo con righe orizzontali */}
            <clipPath id="celticClip">
              <path d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z" />
            </clipPath>
            <g clipPath="url(#celticClip)">
              {/* alternanza righe: mainColor / secondaryColor */}
              {[...Array(6)].map((_, i) => (
                <rect
                  key={i}
                  x={50}
                  y={40 + i * 18}
                  width={100}
                  height={18}
                  fill={i % 2 === 0 ? mainColor : secondaryColor}
                />
              ))}
            </g>

            {/* contorno maglia */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill="none"
              stroke="black"
              strokeWidth={2}
            />

            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="145"
            fontSize="18"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'roma':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* corpo con righe orizzontali sottili tono su tono */}
            <clipPath id="romaClip">
              <path d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z" />
            </clipPath>
            <g clipPath="url(#romaClip)">
              {/* sfondo principale */}
              <rect x={50} y={40} width={100} height={120} fill={mainColor} />
              {/* righe tono su tono (leggero contrasto) */}
              {[...Array(12)].map((_, i) => (
                <rect
                  key={i}
                  x={50}
                  y={40 + i * 10}
                  width={100}
                  height={5}
                  fill={secondaryColor}
                  opacity={0.2}
                />
              ))}
            </g>

            {/* contorno */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill="none"
              stroke="black"
              strokeWidth={2}
            />

            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'america':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* corpo con motivo a V */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            <path
              d="M50 40 L100 100 L150 40 L140 40 L100 90 L60 40 Z"
              fill={secondaryColor}
            />

            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'palmeiras':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* corpo base */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />

            {/* croce centrale */}
            <rect x="95" y="40" width="10" height="110" fill={secondaryColor} />
            <rect x="60" y="85" width="80" height="10" fill={secondaryColor} />

            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'germany':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* corpo con zig-zag */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />

            {/* zig-zag pattern */}
            <path
              d="
            M50 80 
            L70 110 
            L90 80 
            L110 110 
            L130 80 
            L150 110
            L150 150 
            L130 150 
            L110 120 
            L90 150 
            L70 120 
            L50 150
            Z"
              fill={secondaryColor}
            />

            {collar}
          </g>

          {/* numero */}
          <text
            x="148"
            y="145"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'veneziaFC':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* corpo base con arrotondamento in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />

            {/* triangoli decorativi */}
            <polygon points="50,40 75,70 50,100" fill={secondaryColor} />
            <polygon points="150,40 125,70 150,100" fill={secondaryColor} />
            <polygon points="75,70 125,70 100,100" fill={secondaryColor} />
            <polygon points="60,100 140,100 100,130" fill={secondaryColor} />

            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'manUnited':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />

            {/* corpo base con arrotondamento in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />

            {/* pattern astratto: curve sovrapposte */}
            <path
              d="M60 60 C90 80, 110 40, 140 70"
              stroke={secondaryColor}
              strokeWidth={5}
              fill="none"
            />
            <path
              d="M60 90 C90 110, 110 70, 140 100"
              stroke={secondaryColor}
              strokeWidth={5}
              fill="none"
            />
            <path
              d="M60 120 C90 140, 110 100, 140 130"
              stroke={secondaryColor}
              strokeWidth={5}
              fill="none"
            />

            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'manCity':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <defs>
            <linearGradient id="stripeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mainColor} stopOpacity="1" />
              <stop offset="100%" stopColor={mainColor} stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />
            {/* corpo base */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            {/* strisce verticali sottili sfumate */}
            {[...Array(10)].map((_, i) => {
              const x = 50 + i * 10
              return (
                <rect
                  key={`stripe-${i}`}
                  x={x}
                  y="40"
                  width={i % 2 === 0 ? 6 : 4}
                  height="110"
                  fill={i % 2 === 0 ? 'url(#stripeGradient)' : secondaryColor}
                  opacity={i % 2 === 0 ? 1 : 0.8}
                />
              )
            })}
            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'chelsea':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <defs>
            <linearGradient id="horizontalGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={mainColor} stopOpacity="1" />
              <stop offset="100%" stopColor={mainColor} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />
            {/* corpo con arrotondamento in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            {/* strisce orizzontali sfumate */}
            {[...Array(7)].map((_, i) => {
              const y = 40 + i * 15
              return (
                <rect
                  key={`stripe-${i}`}
                  x="50"
                  y={y}
                  width="100"
                  height="10"
                  fill="url(#horizontalGradient)"
                  opacity={i % 2 === 0 ? 1 : 0.6}
                />
              )
            })}
            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="157"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'juventus':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <defs>
            <linearGradient id="stripeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mainColor} stopOpacity="1" />
              <stop offset="100%" stopColor={mainColor} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="altStripeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.8" />
              <stop
                offset="100%"
                stopColor={secondaryColor}
                stopOpacity="0.4"
              />
            </linearGradient>
          </defs>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />
            {/* corpo con arrotondamento in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            {/* strisce verticali sfumate */}
            {[...Array(7)].map((_, i) => {
              const x = 50 + i * 15
              return (
                <rect
                  key={`stripe-${i}`}
                  x={x}
                  y={40}
                  width={10}
                  height={110}
                  fill={
                    i % 2 === 0
                      ? 'url(#stripeGradient)'
                      : 'url(#altStripeGradient)'
                  }
                />
              )
            })}
            {/* colletto */}
            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'lazio':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <defs>
            <linearGradient id="lazioGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mainColor} stopOpacity="1" />
              <stop
                offset="100%"
                stopColor={secondaryColor}
                stopOpacity="0.7"
              />
            </linearGradient>
          </defs>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />
            {/* corpo con arrotondamento in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill="url(#lazioGrad)"
            />
            {/* pattern diagonale sottile */}
            {[...Array(10)].map((_, i) => (
              <line
                key={`diagLine-${i}`}
                x1={65 + i * 10}
                y1="40"
                x2={55 + i * 10}
                y2="150"
                stroke={secondaryColor}
                strokeWidth="1"
                opacity="0.5"
              />
            ))}

            {/* colletto */}
            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'barcelona':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <defs>
            <linearGradient id="barcaGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mainColor} stopOpacity="1" />
              <stop
                offset="100%"
                stopColor={secondaryColor}
                stopOpacity="0.7"
              />
            </linearGradient>
            <linearGradient id="barcaGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={secondaryColor} stopOpacity="1" />
              <stop offset="100%" stopColor={mainColor} stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <g stroke="black" strokeWidth={2}>
            {/* maniche */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />
            {/* corpo con arrotondamento in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill="none"
            />
            {/* bande verticali sfumate */}
            {[...Array(5)].map((_, i) => (
              <rect
                key={`stripe-${i}`}
                x={50 + i * 20}
                y={40}
                width={10}
                height={110}
                fill={i % 2 === 0 ? 'url(#barcaGrad1)' : 'url(#barcaGrad2)'}
              />
            ))}

            {/* colletto */}
            {collar}
          </g>

          {/* numero */}
          <text
            x="130"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'milan':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <defs>
            <linearGradient id="milanGradRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mainColor} stopOpacity="1" />
              <stop
                offset="100%"
                stopColor={secondaryColor}
                stopOpacity="0.6"
              />
            </linearGradient>
            <linearGradient id="milanGradBlack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={secondaryColor} stopOpacity="1" />
              <stop offset="100%" stopColor={mainColor} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <g stroke="black" strokeWidth={2}>
            {/* maniche tutte nere (secondaryColor) */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />
            {/* corpo con righe verticali larghe */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill="none"
            />
            {[...Array(3)].map((_, i) => (
              <rect
                key={`milanStripe-${i}`}
                x={50 + i * 33}
                y={40}
                width={20}
                height={110}
                fill={
                  i % 2 === 0 ? 'url(#milanGradRed)' : 'url(#milanGradBlack)'
                }
              />
            ))}

            {/* colletto */}
            {collar}
          </g>

          {/* numero */}
          <text
            x="133"
            y="145"
            fontSize="18"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )
    case 'tottenham':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <defs>
            <linearGradient id="tottenhamGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={mainColor} stopOpacity="1" />
              <stop
                offset="100%"
                stopColor={secondaryColor}
                stopOpacity="0.7"
              />
            </linearGradient>
          </defs>
          <g stroke="black" strokeWidth={2}>
            {/* maniche bianche con bordo sfumato */}
            <rect x="20" y="40" width="30" height="40" fill={thirdColor} />
            <rect x="150" y="40" width="30" height="40" fill={thirdColor} />
            {/* corpo con fascia orizzontale sottile */}
            <rect
              x="50"
              y="80"
              width="100"
              height="20"
              fill="url(#tottenhamGrad)"
            />
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            {/* colletto */}
            {collar}
          </g>

          {/* numero */}
          <text
            x="140"
            y="155"
            fontSize="20"
            fontWeight="bold"
            textAnchor="end"
            fill={textColor}
          >
            {number}
          </text>
        </svg>
      )

    default:
      return null
  }
}

const JerseySelector = () => {
  const [alertMessage, setAlertMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mainColor, setMainColor] = useState('#ff0000')
  const [secondaryColor, setSecondaryColor] = useState('#ffffff')
  const [thirdColor, setThirdColor] = useState('#000000')
  const [textColor, setTextColor] = useState('#000000')
  const [shirtNumber, setShirtNumber] = useState(10)
  const [selectedTemplate, setSelectedTemplate] =
    useState<ShirtTemplate>('solid')
  const [maglia, setMaglia] = useState<magliaType | undefined>({
    mainColor: '#ff0000',
    secondaryColor: '#ffffff',
    thirdColor: '#000000',
    textColor: '#000000',
    shirtNumber: 10,
    selectedTemplate: 'solid',
  })

  const squadra = api.squadre.getMaglia.useQuery()

  const updateMaglia = api.squadre.updateMaglia.useMutation({
    onSuccess: async () => {
      setAlertMessage('Salvataggio completato')
      squadra.refetch()
    },
  })

  useEffect(() => {
    if (!squadra.isFetching && squadra.isSuccess && squadra.data) {
      setMaglia(squadra.data)
      setMainColor(squadra.data.mainColor)
      setSecondaryColor(squadra.data.secondaryColor)
      setThirdColor(squadra.data.thirdColor)
      setTextColor(squadra.data.textColor)
      setShirtNumber(squadra.data.shirtNumber)
      setSelectedTemplate(squadra.data.selectedTemplate as ShirtTemplate)
    }
  }, [squadra.data, squadra.isSuccess, squadra.isFetching])

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)

    updateMaglia.mutate({
      mainColor: mainColor,
      secondaryColor: secondaryColor,
      thirdColor: thirdColor,
      textColor: textColor,
      shirtNumber: shirtNumber as number,
      selectedTemplate: selectedTemplate,
    })
    setOpenAlert(true)
    setSaving(false)
  }

  return (
    <Box component="form" onSubmit={handleSave} noValidate>
      <Typography variant="h6" gutterBottom>
        Scegli i colori sociali
      </Typography>
      <br></br>
      <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
        <FormControl>
          <InputLabel shrink htmlFor="main-color">
            1° Colore
          </InputLabel>
          <OutlinedInput
            id="main-color"
            type="color"
            value={mainColor}
            onChange={(e) => setMainColor(e.target.value)}
            sx={{
              width: 96,
              height: 36,
              padding: 0,
              borderRadius: 2,
              '& input': {
                padding: 1,
                width: '90%',
                height: '90%',
                cursor: 'pointer',
              },
            }}
          />
        </FormControl>

        <FormControl>
          <InputLabel shrink htmlFor="secondary-color">
            2° Colore
          </InputLabel>
          <OutlinedInput
            id="secondary-color"
            type="color"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            sx={{
              width: 96,
              height: 36,
              padding: 0,
              borderRadius: 2,
              '& input': {
                padding: 1,
                width: '90%',
                height: '90%',
                cursor: 'pointer',
              },
            }}
          />
        </FormControl>

        <FormControl>
          <InputLabel shrink htmlFor="third-color">
            Maniche
          </InputLabel>
          <OutlinedInput
            id="third-color"
            type="color"
            value={thirdColor}
            onChange={(e) => setThirdColor(e.target.value)}
            sx={{
              width: 96,
              height: 36,
              padding: 0,
              borderRadius: 2,
              '& input': {
                padding: 1,
                width: '90%',
                height: '90%',
                cursor: 'pointer',
              },
            }}
          />
        </FormControl>
      </Stack>

      <Typography variant="h6" gutterBottom>
        Seleziona numero maglia
      </Typography>
      <br></br>
      <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
        <FormControl>
          <FormControl>
            <InputLabel id="jersey-number-label">Numero di maglia</InputLabel>
            <Select
              labelId="jersey-number-label"
              value={shirtNumber}
              onChange={(e) => setShirtNumber(e.target.value as number)}
              label="Numero di maglia"
              sx={{ minWidth: 120 }}
            >
              {Array.from({ length: 11 }, (_, i) => (
                <MenuItem key={i + 1} value={(i + 1) as number}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            component="fieldset"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <FormLabel component="legend">Colore numero</FormLabel>
            <RadioGroup
              row
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              name="jersey-text-color"
            >
              <FormControlLabel
                value="black"
                control={<Radio />}
                label="Nero"
              />
              <FormControlLabel
                value="white"
                control={<Radio />}
                label="Bianco"
              />
            </RadioGroup>
          </FormControl>
        </FormControl>
      </Stack>
      <Typography variant="h6" gutterBottom>
        Seleziona una tipologia di maglia
      </Typography>

      <ToggleButtonGroup
        value={selectedTemplate}
        exclusive
        onChange={(_, val) => val && setSelectedTemplate(val)}
        sx={{ mb: 4, flexWrap: 'wrap' }}
      >
        {shirtCollections.map((template) => (
          <ToggleButton key={template} value={template} sx={{ width: 100 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <JerseySVG
                template={template}
                mainColor={mainColor}
                secondaryColor={secondaryColor}
                thirdColor={thirdColor}
                textColor={textColor}
                size={60}
                number={shirtNumber}
              />

              <Typography variant="caption">{template}</Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Grid container spacing={0}>
        <Grid item xs={6} md={3}>
          {!squadra.isLoading && maglia ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Maglia attuale
              </Typography>
              <JerseySVG
                template={maglia.selectedTemplate as ShirtTemplate}
                mainColor={maglia.mainColor}
                secondaryColor={maglia.secondaryColor}
                thirdColor={maglia.thirdColor}
                textColor={maglia.textColor}
                size={150}
                number={maglia.shirtNumber}
              />
            </Box>
          ) : (
            <Box>
              <CircularProgress color="info" />
            </Box>
          )}
        </Grid>
        <Grid item xs={6} md={3}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Anteprima nuova maglia
            </Typography>
            <JerseySVG
              template={selectedTemplate}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
              thirdColor={thirdColor}
              textColor={textColor}
              size={150}
              number={shirtNumber}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            type="submit"
            disabled={saving}
            endIcon={!saving ? <Save /> : <HourglassTop />}
            variant="contained"
            color="primary"
            size="medium"
          >
            {saving ? 'Attendere...' : 'Salva'}
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ height: '60%' }}
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert
          onClose={() => setOpenAlert(false)}
          severity={'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default JerseySelector
