export function mergePlayers(data) {
    const {
      bio,
      scoutRankings,
      measurements,
      game_logs,
      seasonLogs,
      scoutingReports
    } = data;
  
    return bio.map((player) => {
      const id = player.playerId;
  
      return {
        ...player,
        rankings: scoutRankings.find(r => r.playerId === id) || {},
        measurement: measurements.find(m => m.playerId === id) || {},
        seasonStats: seasonLogs.find(s => s.playerId === id) || {},
        gameLogs: game_logs.filter(g => g.playerId === id) || [],
        reports: scoutingReports.filter(r => r.playerId === id) || [],
      };
    });
  }
  