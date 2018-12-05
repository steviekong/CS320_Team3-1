import React, { Component } from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';

class MainPage extends Component {
    //Javascript functions go here:
    constructor(props) {
        super(props);
        this.state = {
            jsonList: [],
        }
        this.selectAll = this.selectAll.bind(this);
        this.unselectAll = this.unselectAll.bind(this);
    }
    

    selectAll(e) {
        e.preventDefault();
        var allInputs = document.getElementsByTagName("input");
        for (var i = 0, max = allInputs.length; i < max; i++) {
            if (allInputs[i].type === 'checkbox')
                allInputs[i].checked = true;
        }
    }

unselectAll(e) {
    e.preventDefault();
    var allInputs = document.getElementsByTagName("input");
    for (var i = 0, max = allInputs.length; i < max; i++) {
        if (allInputs[i].type === 'checkbox')
            allInputs[i].checked = false;
}   
}
    downloadSelected() {
    if(this.checked){
        console.log("this is checked");
    }
    else{
        console.log("this is not checked");
    }
}

    //Executes the axios command which fetches 50 systems and places it into jsonList
    componentDidMount() {
        axios.get(`http://filemasterxp-env.7hpy2sty52.us-east-1.elasticbeanstalk.com/all`)
          .then(res => {
            const jsonList = res.data;
            this.setState({ jsonList });
            console.log('Axios call Success')
          })
          .catch(error => {
            console.log('Axios call failed');
          })
      }

      checkIfChecked() {
        document.getElementById("select-all")
        
      }

    render() {
        //Headers for the main display table
        const headers = [
            'serialNumberInserv',
            'Date(YYY-MM-DDTHH:mm:ssZ)',
            'authorized tenants',
            'Select',
            'Download'
        ];

        const HeaderRow = () => (
            <tr bgcolor ="Silver">
                {headers.map(header => (
                    header === 'Select' ? 
                    <th>{header}<input id='select-all' type = "checkbox" onChange={this.checkIfChecked() ? this.selectAll : this.unselectAll} /></th> : 
                    <th>{header}</th>
                ))}
            </tr>
        );
        
        //Component that defines what each row of the table displays
        const Row = ({serialNumberInserv, date, authorizedTenants, data}) => (
            <tr bgcolor = "Gainsboro">
                <td>{serialNumberInserv}</td>
                <td>{date}</td>
                <td>{authorizedTenants}</td>
                <td> <input type = "checkbox" /> </td>
                <td><a href={data} download={serialNumberInserv+".json"}><img src="download icon.png" /></a></td>
            </tr>
        );

        //Component that collects all rows into an array to display in the table
        const Rows = () => {
            const rows = [];

            for (let i = 0; i < this.state.jsonList.length; i++) {
                //Parses JSON object for corresponding data
                const sni = this.state.jsonList[i].serialNumberInserv;
                const d = this.state.jsonList[i].date;
                const at = this.state.jsonList[i].authorized.tenants;
                const obj = this.state.jsonList[i];
                var dat = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

                //Defines a row with the info from the current json object and adds it to the list of rows
                rows.push(<Row serialNumberInserv={sni} date={d} authorizedTenants={at} data={dat}/>);
            }
            return rows;
        };

    return(
        <div>
            <link rel="stylesheet" href="style.css" />
            <p >File_MasterXP</p> <button>Log Out</button>
            <hr/>

            <SearchBar 
                selectAll={this.selectAll} 
                unselectAll={this.unselectAll}
            />

            <br/>

            <div class = "table"> 
                <table  width="90%" border="1" 
                cellpadding="10"
                align="center">
                    <HeaderRow />
                    <Rows />
                </table>
            </div>
            <div class = "bottomIcon" align = "center">
                <ul>
                    <li><a href="#"><img src="left icon.png" /></a></li>
                    <li><a href="#">Go to First Page</a></li>
                    <li><a href="#">Go to Last page</a></li>
                    <li><a href="#"><img href ="#" src="right icon.png" /></a></li>
                </ul>
            </div>
        </div>
        );
    }
}

export default MainPage;