import React from 'react';
import { withTheme } from 'material-ui/styles';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';

class OasConfigurator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            oas: props.oas,
            selected: [],
        };
    };

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.title) !== JSON.stringify(nextProps.title)) {
            this.setState({
                oas: nextProps.oas,
                selected: []
            });
        }
    }

    componentDidMount() {
        const cachedSelections = localStorage.getItem('paths_selected');
        if (cachedSelections) {
            this.setState({
                selected: JSON.parse(cachedSelections)
            });
        }
    }

    cacheSelections = selections => {
        localStorage.setItem('paths_selected', JSON.stringify(selections));
    };

  

    handleCheck = index => event => {
        if (event.target.checked) {
            this.setState(prevState => ({
                selected: [...prevState.selected, index]
            }), () => {
                this.cacheSelections(this.state.selected);
            });
        } else {
            let value = index;
            this.setState(prevState => ({
                selected: [...prevState.selected.filter(item => item !== value)]
            }), () => {
                this.cacheSelections(this.state.selected);
            });
        }
    };

    hostFromUrl = urlString => {
        const url = new URL(urlString);
        return url.hostname;
    };

    pathFromUrl = urlString => {
        const url = new URL(urlString);
        return url.pathname;
    };

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


    render() {

        const { oas } = this.state;
        const { theme } = this.props;
        const styles = {
            cardHeader: {
                backgroundColor: theme.palette.primary[700]
            },
            cardContent: {
                //backgroundColor: theme.palette.primary[200],
                backgroundColor: theme.palette.secondary[400],
                //padding: 12,
            },
            cardActions: {
                backgroundColor: theme.palette.secondary[500],
                padding: 12,
            },
            listRoot: {
                width: '100%',
                borderRadius: "3px",
                backgroundColor: theme.palette.background.paper,
            },
            container: {
                display: 'flex',
                flexWrap: 'wrap',
                //padding: theme.spacing.unit,
            },
            textField: {
                margin: theme.spacing.unit,
                width: 200,
            },
            card: {

            },
        };

        const paths = Object.entries(oas.paths);

        const entries = <div style={styles.listRoot}>
            <List style={styles.list}>
                {paths.map(
                    (path, index) => (
                        <div key={`entry-div-${index}`}>
                            <ListItem
                                key={`entry-${index}`}
                                dense
                            >
                                <Checkbox
                                    onChange={this.handleCheck(index)}
                                    key={`entry-${index}`}
                                    value={`${index}`}
                                    checked={this.state.selected.includes(index)? true: false}
                                />
                                <ListItemText
                                    primary={`${path[0]}`}
                                     />
                            </ListItem>

                            {(index + 1) < paths.length &&
                                <Divider />
                            }
                        </div>
                    ))}
            </List>
        </div>;

        return (
                <Card style={styles.card}>
                    <CardHeader
                        style={styles.cardHeader}
                        title="OAS Configurator"
                        subheader="Select oas paths to be used for the sequence diagram." />
                    <CardContent style={styles.cardContent}>
                        {entries}
                    </CardContent>
                    <CardActions style={styles.cardActions}>
                        <Button raised dense color="accent" onClick={this.props.handler}>
                            Transform
                        </Button>
                    </CardActions>
                </Card>
        );
    }
}

export default withTheme()(OasConfigurator);