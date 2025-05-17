'use client'

import React, { useState } from 'react'
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material'

type JerseyTemplate = 'solid' | 'stripes' | 'centerLine' | 'bicolor'

const JerseySVG = ({
  template,
  mainColor,
  secondaryColor,
  thirdColor,
  size = 200,
  number = '',
}: {
  template: JerseyTemplate
  mainColor: string
  secondaryColor: string
  thirdColor: string
  size?: number
  number?: string
}) => {
  switch (template) {
    case 'solid':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            {/* maniche senza arrotondamenti */}
            <rect x="20" y="40" width="30" height="40" fill={mainColor} />
            <rect x="150" y="40" width="30" height="40" fill={mainColor} />
            {/* corpo con arrotondamento solo in basso */}
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            {/* numero */}
            <text
              x="140"
              y="155"
              fontSize="20"
              fontWeight="bold"
              textAnchor="end"
              fill="white"
            >
              {number}
            </text>
          </g>
        </svg>
      )
    case 'stripes':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            <rect x="20" y="40" width="30" height="40" fill={mainColor} />
            <rect x="150" y="40" width="30" height="40" fill={mainColor} />
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
            <text
              x="140"
              y="155"
              fontSize="20"
              fontWeight="bold"
              textAnchor="end"
              fill="white"
            >
              {number}
            </text>
          </g>
        </svg>
      )
    case 'centerLine':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            <rect x="20" y="40" width="30" height="40" fill={mainColor} />
            <rect x="150" y="40" width="30" height="40" fill={mainColor} />
            <path
              d="M50 40 H150 V150 Q150 160 140 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            {/* center stripe */}
            <rect x="95" y="40" width="10" height="110" fill={secondaryColor} />
            <text
              x="140"
              y="155"
              fontSize="20"
              fontWeight="bold"
              textAnchor="end"
              fill="white"
            >
              {number}
            </text>
          </g>
        </svg>
      )
    case 'bicolor':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g stroke="black" strokeWidth={2}>
            <rect x="20" y="40" width="30" height="40" fill={mainColor} />
            <rect x="150" y="40" width="30" height="40" fill={secondaryColor} />
            {/* left half */}
            <path
              d="M50 40 H100 V150 Q100 160 90 160 H60 Q50 160 50 150 Z"
              fill={mainColor}
            />
            {/* right half */}
            <path
              d="M100 40 H150 V150 Q150 160 140 160 H110 Q100 160 100 150 Z"
              fill={secondaryColor}
            />
            <text
              x="140"
              y="155"
              fontSize="20"
              fontWeight="bold"
              textAnchor="end"
              fill="white"
            >
              {number}
            </text>
          </g>
        </svg>
      )
    default:
      return null
  }
}

const JerseySelector = () => {
  const [mainColor, setMainColor] = useState('#ff0000')
  const [secondaryColor, setSecondaryColor] = useState('#ffffff')
  const [thirdColor, setThirdColor] = useState('#000000')
  const [jerseyNumber, setJerseyNumber] = useState('10')
  const [selectedTemplate, setSelectedTemplate] =
    useState<JerseyTemplate>('solid')

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Scegli i colori sociali
      </Typography>
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
              height: 24,
              padding: 0,
              borderRadius: 2,
              '& input': {
                padding: 0,
                width: '100%',
                height: '100%',
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
              height: 24,
              padding: 0,
              borderRadius: 2,
              '& input': {
                padding: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
              },
            }}
          />
        </FormControl>

        <FormControl>
          <InputLabel shrink htmlFor="third-color">
            3° Colore
          </InputLabel>
          <OutlinedInput
            id="third-color"
            type="color"
            value={thirdColor}
            onChange={(e) => setThirdColor(e.target.value)}
            sx={{
              width: 96,
              height: 24,
              padding: 0,
              borderRadius: 2,
              '& input': {
                padding: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
              },
            }}
          />
        </FormControl>

        <FormControl>
          <TextField
            label="Numero di maglia"
            type="number"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
            inputProps={{ maxLength: 2, pattern: '[0-9]*' }}
          />
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
        {(
          ['solid', 'stripes', 'centerLine', 'bicolor'] as JerseyTemplate[]
        ).map((template) => (
          <ToggleButton key={template} value={template}>
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
                size={60}
                number={jerseyNumber}
              />

              <Typography variant="caption">{template}</Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Typography variant="h6" gutterBottom>
        Maglia selezionata
      </Typography>
      <Box sx={{ mt: 2 }}>
        <JerseySVG
          template={selectedTemplate}
          mainColor={mainColor}
          secondaryColor={secondaryColor}
          thirdColor={thirdColor}
          size={200}
          number={jerseyNumber}
        />
      </Box>
    </Box>
  )
}

export default JerseySelector
