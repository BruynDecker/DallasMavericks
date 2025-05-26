import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Typography, TextField, Button, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody, Box
} from '@mui/material';

function PlayerProfile({ players }) {
  const { id } = useParams();
  const player = players.find(p => p.playerId === Number(id));

  const [reports, setReports] = useState(player.reports || []);
  const [newReport, setNewReport] = useState('');
  const [statMode, setStatMode] = useState('perGame');

  const handleAddReport = () => {
    if (newReport.trim()) {
      setReports([...reports, { scout: "You", report: newReport }]);
      setNewReport('');
    }
  };

  const getAverageRank = (rankings) => {
    const values = Object.entries(rankings || {})
      .filter(([k, v]) => k !== 'playerId' && typeof v === 'number')
      .map(([_, v]) => v);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  };

  const avgRank = getAverageRank(player.rankings || {});
  const scoutNames = Object.keys(player.rankings || {}).filter(name => name !== "playerId");

  return (
    <Box className="container" sx={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#007DC5', fontWeight: 500 }}>← Back to Scout Rankings</Link>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: '2rem',
          marginTop: '2rem'
        }}
      >
        {/* Left Column: Photo + Bio */}
        <Box sx={{ width: { md: '35%' } }}>
          <img
            src={player.photoUrl}
            alt={`${player.firstName} ${player.lastName}`}
            style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }}
          />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {player.firstName} {player.lastName}
          </Typography>
          <Typography variant="subtitle1" gutterBottom color="text.secondary">
            {player.currentTeam}
          </Typography>
          <Typography variant="body2">Birthdate: {player.birthDate}</Typography>
          <Typography variant="body2">Hometown: {player.homeTown}, {player.homeState}</Typography>
          <Typography variant="body2">High School: {player.highSchool} ({player.highSchoolState})</Typography>
          <Typography variant="body2">Height: {player.measurement.heightShoes}"</Typography>
          <Typography variant="body2">Wingspan: {player.measurement.wingspan}"</Typography>
        </Box>

        {/* Right Column: Rankings, Stats, Reports */}
        <Box sx={{ flex: 1 }}>
          {/* Scout Rankings */}
          <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>Scout Rankings</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Average Rank: {avgRank?.toFixed(2) ?? 'N/A'}
          </Typography>

          <Table size="small" sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>Scout</TableCell>
                <TableCell>Rank</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoutNames.map((scout, idx) => {
                const rank = player.rankings[scout];
                let symbol = '', style = {};
                if (typeof rank === 'number' && typeof avgRank === 'number') {
                  if (rank - avgRank >= 2) {
                    symbol = '🔻';
                    style = { backgroundColor: '#ffebee', color: '#c62828', fontWeight: 'bold' };
                  } else if (avgRank - rank >= 2) {
                    symbol = '🔺';
                    style = { backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold' };
                  }
                }
                return (
                  <TableRow key={idx}>
                    <TableCell>{scout}</TableCell>
                    <TableCell sx={style}>{rank ?? 'N/A'} {symbol}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Season Stats */}
          <Typography variant="h6" fontWeight={600}>Season Stats</Typography>
          <TextField
            select
            label="Stat Mode"
            value={statMode}
            onChange={(e) => setStatMode(e.target.value)}
            SelectProps={{ native: true }}
            margin="dense"
            fullWidth
            sx={{ maxWidth: '300px', mb: 2 }}
          >
            <option value="perGame">Average Per Game</option>
            <option value="total">Season Totals</option>
          </TextField>

          <ul style={{ paddingLeft: '1.2rem' }}>
            <li>Games Played: {player.seasonStats.GP}</li>
            <li>
              Points: {
                statMode === 'perGame'
                  ? player.seasonStats.PTS
                  : (player.seasonStats.PTS * player.seasonStats.GP).toFixed(1)
              }
            </li>
            <li>
              Assists: {
                statMode === 'perGame'
                  ? player.seasonStats.AST
                  : (player.seasonStats.AST * player.seasonStats.GP).toFixed(1)
              }
            </li>
            <li>
              Rebounds: {
                statMode === 'perGame'
                  ? player.seasonStats.TRB
                  : (player.seasonStats.TRB * player.seasonStats.GP).toFixed(1)
              }
            </li>
          </ul>

          {/* Reports */}
          <Typography variant="h6" fontWeight={600} sx={{ mt: 3 }}>Scouting Reports</Typography>
          {reports.map((r, i) => (
            <Card key={i} sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600}>{r.scout}:</Typography>
                <Typography>{r.report}</Typography>
              </CardContent>
            </Card>
          ))}

          {/* Add New Report */}
          <Box sx={{ mt: 2 }}>
            <TextField
              label="New Scouting Report"
              multiline
              fullWidth
              rows={3}
              value={newReport}
              onChange={(e) => setNewReport(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddReport}>
              Add Report
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PlayerProfile;
