// PlayerProfile.jsx
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Typography, TextField, Button, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody, Box
} from '@mui/material';
import './PlayerProfile.css';

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

  const statLabel = statMode === 'perGame' ? '(per game)' : '(total)';
  const getStat = (value) => statMode === 'perGame' ? value : (value * player.seasonStats.GP).toFixed(1);

  return (
    <Box className="player-container">
      <Link to="/" className="player-backlink">← Back to Scout Rankings</Link>

      <Box className="profile-grid">
        <Box className="profile-left">
          <Box className="profile-header">
            <img src={player.photoUrl} alt={player.firstName} />
            <Box className="profile-info">
              <Typography variant="h5" fontWeight={700}>
                {player.firstName} {player.lastName}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {player.currentTeam}
              </Typography>
              <Typography variant="body2">Rank Avg: {avgRank?.toFixed(2) ?? 'N/A'}</Typography>
              <Typography variant="body2">Ht: {player.measurement.heightShoes}" | Wing: {player.measurement.wingspan}"</Typography>
              <Typography variant="body2">Birth: {player.birthDate}</Typography>
              <Typography variant="body2">From: {player.homeTown}, {player.homeState}</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="profile-center">
          <Typography variant="h6" className="player-section-title">Full Stats {statLabel}</Typography>

          <Box className="profile-stats-toggle">
            <TextField
              select
              label="Stat Mode"
              value={statMode}
              onChange={(e) => setStatMode(e.target.value)}
              SelectProps={{ native: true }}
              size="small"
              fullWidth
            >
              <option value="perGame">Per Game</option>
              <option value="total">Totals</option>
            </TextField>
          </Box>

          <ul className="stat-list">
            <li><strong>Games Played:</strong> {player.seasonStats.GP}</li>
            <li><strong>Minutes:</strong> {getStat(player.seasonStats.MP)} {statLabel}</li>
            <li><strong>Points:</strong> {getStat(player.seasonStats.PTS)} {statLabel}</li>
            <li><strong>Assists:</strong> {getStat(player.seasonStats.AST)} {statLabel}</li>
            <li><strong>Rebounds:</strong> {getStat(player.seasonStats.TRB)} {statLabel}</li>
            <li><strong>• Offensive Rebounds:</strong> {getStat(player.seasonStats.ORB)} {statLabel}</li>
            <li><strong>• Defensive Rebounds:</strong> {getStat(player.seasonStats.DRB)} {statLabel}</li>
            <li><strong>Steals:</strong> {getStat(player.seasonStats.STL)} {statLabel}</li>
            <li><strong>Blocks:</strong> {getStat(player.seasonStats.BLK)} {statLabel}</li>
            <li><strong>Turnovers:</strong> {getStat(player.seasonStats.TOV)} {statLabel}</li>
            <li><strong>Personal Fouls:</strong> {getStat(player.seasonStats.PF)} {statLabel}</li>
            <li><strong>FGM / FGA:</strong> {player.seasonStats.FGM} / {player.seasonStats.FGA} ({player.seasonStats["FG%"]}%)</li>
            <li><strong>• 2PT:</strong> {player.seasonStats.FG2M} / {player.seasonStats.FG2A} ({player.seasonStats["FG2%"]}%)</li>
            <li><strong>• 3PT:</strong> {player.seasonStats["3PM"]} / {player.seasonStats["3PA"]} ({player.seasonStats["3P%"]}%)</li>
            <li><strong>Free Throws:</strong> {player.seasonStats.FT} / {player.seasonStats.FTA} ({player.seasonStats.FTP}%)</li>
            <li><strong>eFG%:</strong> {player.seasonStats["eFG%"]}%</li>
          </ul>
        </Box>

        <Box className="profile-right">
          <Typography variant="h6" className="player-section-title">Scout Rankings</Typography>
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

          <Typography variant="h6" className="player-section-title">Scouting Reports</Typography>
          {reports.map((r, i) => (
            <Card key={i} className="scout-card">
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600}>{r.scout}:</Typography>
                <Typography>{r.report}</Typography>
              </CardContent>
            </Card>
          ))}

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
