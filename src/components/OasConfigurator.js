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
            selected: {},
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



    handleCheck = (path, method) => event => {
        let selected = this.state.selected;
        if (event.target.checked) {
            if (selected[path]) {
                selected[path].push(method)
            } else {
                selected[path] = [method];
            }
            this.setState(prevState => ({
                selected
            }), () => {
                this.cacheSelections(this.state.selected);
            });
        } else {
            selected[path] = selected[path].filter(item => item !== method)
            this.setState(prevState => ({
                selected
            }), () => {
                this.cacheSelections(this.state.selected);
            });
        }
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

        const methods = ['get', 'put', 'post', 'delete']

        const entries = <div style={styles.listRoot}>
            <List style={styles.list}>
                {Object.keys(oas.paths).map(
                    (path, pathIndex) => (
                        <div key={`path-div-${pathIndex}`}>
                            <ListItem
                                key={`path-${pathIndex}`}
                                dense>
                                <ListItemText primary={path} />
                            </ListItem>
                            <List disablePadding>
                                {Object.keys(oas.paths[path]).map(
                                    (method, methodIndex) => (
                                        <div key={`div:${pathIndex}:${methodIndex}`}>
                                            {methods.includes(method) &&
                                                <ListItem className={theme.nested} key={`li:${pathIndex}:${methodIndex}`} dense>
                                                    <Checkbox
                                                        onChange={this.handleCheck(path, method)}
                                                        key={`cb:${pathIndex}:${methodIndex}`}
                                                        value={`${pathIndex}:${methodIndex}`}
                                                        checked={this.state.selected[path] && this.state.selected[path].includes(method) ? true : false}
                                                    />
                                                    <ListItemText inset primary={method} />
                                                </ListItem>
                                            }
                                        </div>
                                    ))}
                            </List>

                            {(pathIndex + 1) < Object.keys(oas.paths).length &&
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
                    subheader="Select oas transactions to be used for the sequence diagram." />
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