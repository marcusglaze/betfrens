import React from 'react'

const TeamLogo = ({ name, width, height }) => {
    if (name === 'Atlanta Hawks') {
        return <img src={require(`../assets/nba/atl.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Brooklyn Nets') {
        return <img src={require(`../assets/nba/bkn.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Boston Celtics') {
        return <img src={require(`../assets/nba/bos.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Charlotte Hornets') {
        return <img src={require(`../assets/nba/cha.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Chicago Bulls') {
        return <img src={require(`../assets/nba/chi.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Cleveland Cavaliers') {
        return <img src={require(`../assets/nba/cle.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Dallas Mavericks') {
        return <img src={require(`../assets/nba/dal.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Denver Nuggets') {
        return <img src={require(`../assets/nba/den.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Detroit Pistons') {
        return <img src={require(`../assets/nba/det.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Golden State Warriors') {
        return <img src={require(`../assets/nba/gsw.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Houston Rockets') {
        return <img src={require(`../assets/nba/hou.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Indiana Pacers') {
        return <img src={require(`../assets/nba/ind.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'LA Clippers') {
        return <img src={require(`../assets/nba/lac.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Los Angeles Lakers') {
        return <img src={require(`../assets/nba/lal.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Memphis Grizzlies') {
        return <img src={require(`../assets/nba/mem.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Miami Heat') {
        return <img src={require(`../assets/nba/mia.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Milwaukee Bucks') {
        return <img src={require(`../assets/nba/mil.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Minnesota Timberwolves') {
        return <img src={require(`../assets/nba/min.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'NBA') {
        return <img src={require(`../assets/nba/nba.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'New Orleans Pelicans') {
        return <img src={require(`../assets/nba/nop.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'New York Knicks') {
        return <img src={require(`../assets/nba/nyk.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Oklahoma City Thunder') {
        return <img src={require(`../assets/nba/okc.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Orlando Magic') {
        return <img src={require(`../assets/nba/orl.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Philadelphia 76ers') {
        return <img src={require(`../assets/nba/phi.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Phoenix Suns') {
        return <img src={require(`../assets/nba/phx.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Portland Trailblazers') {
        return <img src={require(`../assets/nba/por.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Sacramento Kings') {
        return <img src={require(`../assets/nba/sac.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'San Antonio Spurs') {
        return <img src={require(`../assets/nba/sas.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Toronto Raptors') {
        return <img src={require(`../assets/nba/tor.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Utah Jazz') {
        return <img src={require(`../assets/nba/uta.png`)} alt='Team Logo' width={width} height={height} />
    } else if (name === 'Washington Wizards') {
        return <img src={require(`../assets/nba/was.png`)} alt='Team Logo' width={width} height={height} />
    } else {
        return <img src={require(`../assets/nba/nba.png`)} alt='Team Logo' width={width} height={height} />
    }
}

export default TeamLogo;
