import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import FileUpload from 'material-ui-icons/FileUpload';
import Snackbar from 'material-ui/Snackbar';
import Fade from 'material-ui/transitions/Fade';

import OasExplorer from './components/OasExplorer';
import OasConfigurator from './components/OasConfigurator';
import PumlText from './components/PumlText';
import plantumlEncoder from 'plantuml-encoder';
import PumlImage from './components/PumlImage';



const styles = {
  root: {
    width: '100%',
  },
  topNav: {
    padding: '1em',
    margin: '1em',
  },
  main: {
    padding: '1em',
  },
  flex: {
    flex: 1,
  },
  input: {
    display: 'none',
  },
  snackbar: {
    //margin: '1em',
  }
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sbOpen: false,
      hasOas: false,
      oas: {},
      title: '',
      puml: null,
      encoded: null,
    };
  };

  componentDidMount() {
    this.loadPumlCache();
    this.loadOasCache();
    this.loadEncodedCache();
  }

  loadPumlCache = () => {
    const cache = localStorage.getItem('puml');
    if (cache) {
      this.setState({
        puml: cache
      });
    }
  }

  loadEncodedCache = () => {
    const cache = localStorage.getItem('encoded');
    if (cache) {
      this.setState({
        encoded: cache
      });
    }
  }

  loadOasCache = () => {
    const harString = localStorage.getItem('oas_content');
    if (harString) {
      let hasOas = true;
      let oas = JSON.parse(harString);
      let title = localStorage.getItem('har_title');
      this.setState({
        oas,
        hasOas,
        title,
      }
      );
    }
  }

  resourceFromPath = pathString => {
    const pathSegments = pathString.split('/');
    const pathLength = pathSegments.length;
    const suspect1 = pathSegments[pathLength - 1]; // last path segment
    const suspect2 = pathSegments[pathLength - 2]; // second to last path segment
    const regex = /v\d/g; // looking for 'v' plus a single digit e.g. 'v1'
    if (regex.test(suspect1)) {
      return suspect2.toLowerCase().replace(/(^| )(\w)/g, s => s.toUpperCase());
    }
    return suspect1.toLowerCase().replace(/(^| )(\w)/g, s => s.toUpperCase());
  };

  pumlfy = (oas, callback) => {
    const selected = JSON.parse(localStorage.getItem('paths_selected'));
    const paths = Object.entries(oas.paths);
    let pumlText = '@startuml\n';
    for (let path in selected) {
      const serviceName = oas.info.title;
      const resourceName = this.resourceFromPath(path);
      const methods = selected[path]
      for (let index in methods) {
        const method = methods[index]
        pumlText +=
          '"User Agent" -> ' + //request
          '"' + serviceName + '"' +
          ': ' + method + resourceName.charAt(0).toUpperCase() + resourceName.slice(1) +
          '(' +
          // queryParams.replace(/,\s*$/, '') +
          ') \n' +
          'note right: ' + //note
          method + ' ' + path +
          '\n' + //response
          '"' + serviceName + '"' + //service
          ' -> "User Agent": ' + //client
          'resStatus' + //method (status?)
          '( ' +
          resourceName + 'resStatusText' + //params (payload)
          ' ) \n';

      }

      // const method = log.entries[path].request.method.toLowerCase();
      // const resStatus = log.entries[path].response.status;

      // let resStatusText;
      // switch (log.entries[path].response.status) {
      //   case 200:
      //     resStatusText = '';
      //     break;
      //   default:
      //     resStatusText = ' ' + log.entries[path].response.statusText;
      //     break;
      // }

      // Query params
      // let queryParams = '';
      // for (var qParam in log.entries[path].request.queryString) {
      //   queryParams += log.entries[path].request.queryString[qParam].name + ', ';
      // }



    }
    pumlText += '@enduml';
    callback(pumlText);
  };

  handleClose = () => {
    this.setState({ sbOpen: false });
  };

  cachePuml = puml => {
    localStorage.setItem('puml', puml);
  };

  cacheEncoded = encoded => {
    localStorage.setItem('encoded', encoded);
  };

  transformHandler = () => {
    //e.preventDefault()
    this.pumlfy(this.state.oas,
      (puml) => {
        let encoded = plantumlEncoder.encode(puml);
        this.cacheEncoded(encoded);
        this.cachePuml(puml);
        this.setState({ puml, encoded });
      });
  }

  oasUpload = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        JSON.parse(reader.result);
      } catch (error) {
        return alert('Not valid JSON!', error)
      }
      localStorage.setItem('oas_content', reader.result);
      localStorage.setItem('har_title', file.name);
      localStorage.removeItem('encoded');
      localStorage.removeItem('paths_selected');
      localStorage.removeItem('puml');
      return this.setState({
        sbOpen: true,
        oas: JSON.parse(reader.result),
        title: file.name,
        hasOas: true,
        encoded: null,
        puml: null,
      });
    };
    reader.readAsText(file);
  };

  render() {
    const { classes } = this.props;
    const { hasOas, title, oas, puml, encoded } = this.state;
    //const hasOas = this.state.hasOas;
    let mainContent, menu;

    menu =
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.flex}>
              Open API Specification to Plant UML
            </Typography>
            <input
              className={classes.input}
              id="file"
              name="file"
              onChange={this.oasUpload}
              type="file"
            />
            <label htmlFor="file">
              <Button raised component="span" color="accent">
                <FileUpload />
                Import OAS
              </Button>
            </label>
          </Toolbar>
        </AppBar>
      </div>

    if (hasOas) {
      mainContent =
        <div className={classes.main}>
          <Grid container spacing={24} direction="column">
            <Grid item md>
              <OasExplorer oas={oas} title={title} />
            </Grid>
            <Grid item md>
              <OasConfigurator oas={oas} title={title} handler={this.transformHandler} />
            </Grid>
            <Grid item md>
              {puml &&
                <PumlText puml={puml} />
              }
            </Grid>
            <Grid item md>
              {encoded &&
                <PumlImage encoded={encoded} />
              }
            </Grid>
          </Grid>
        </div>
    } else {
      mainContent = null;
    }

    return (
      <div>
        <div style={styles.root}>
          {menu}
          {mainContent}
        </div>
        <Snackbar
          className={classes.snackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={2000}
          open={this.state.sbOpen}
          onClose={this.handleClose}
          transition={Fade}
          SnackbarContentProps={{
            'aria-describedby': 'file-imported-message',
          }}
          message={<span id="file-imported-message">{`The file ${title} was imported successfully.`}</span>}
        />
      </div>
    );

  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
