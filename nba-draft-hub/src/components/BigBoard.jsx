import React, { useState } from 'react';
import {
  Card, CardContent, Typography,
  Table, TableHead, TableRow, TableCell, TableBody,
  Select, MenuItem, Box, Grid
} from '@mui/material';
import { Link } from 'react-router-dom';

const getScoutNames = (players) => {
  const scouts = new Set();
  players.forEach(p => {
    Object.keys(p.rankings || {}).forEach(s => s !== 'playerId' && scouts.add(s));
  });
  return [...scouts];
};

const getAverageRank = (rankings) => {
  const vals = Object.entries(rankings || {})
    .filter(([key, val]) => key !== 'playerId' && typeof val === 'number')
    .map(([, val]) => val);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
};

function BigBoard({ players }) {
  const scoutNames = getScoutNames(players);
  const [sortKey, setSortKey] = useState('Average');

  const sortedPlayers = [...players].sort((a, b) => {
    const aHasRank = a.rankings?.[sortKey] !== undefined;
    const bHasRank = b.rankings?.[sortKey] !== undefined;
    const getRank = (p) => p.rankings?.[sortKey] ?? getAverageRank(p.rankings) ?? 999;

    if (aHasRank && !bHasRank) return -1;
    if (!aHasRank && bHasRank) return 1;
    return getRank(a) - getRank(b);
  });

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Scout Rankings</Typography>

      <Box sx={{ mb: 4, maxWidth: 300 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Sort by:</Typography>
        <Select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        >
          <MenuItem value="Average">Average Rank</MenuItem>
          {scoutNames.map(scout => (
            <MenuItem key={scout} value={scout}>{scout}</MenuItem>
          ))}
        </Select>
      </Box>

      <Grid container spacing={3}>
        {sortedPlayers.map(player => {
          const avg = getAverageRank(player.rankings);
          return (
            <Grid item xs={12} sm={6} md={4} key={player.playerId}>
              <Card
                sx={{
                  borderRadius: 3,
                  transition: '0.3s',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    <Link to={`/player/${player.playerId}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                      {player.firstName} {player.lastName}
                    </Link>
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {player.currentTeam} — Avg Rank: <b>{avg?.toFixed(2) ?? 'N/A'}</b>
                  </Typography>

                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {scoutNames.map(scout => (
                          <TableCell key={scout} sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{scout}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {scoutNames.map(scout => {
                          const rank = player.rankings?.[scout];
                          let symbol = '', style = {};
                          if (typeof rank === 'number' && typeof avg === 'number') {
                            if (rank - avg >= 2) {
                              symbol = '🔻';
                              style = { backgroundColor: '#ffebee', color: '#c62828', fontWeight: 'bold' };
                            } else if (avg - rank >= 2) {
                              symbol = '🔺';
                              style = { backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold' };
                            }
                          }
                          return (
                            <TableCell key={scout} sx={style}>
                              {typeof rank === 'number' ? rank : '—'} {symbol}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default BigBoard;
