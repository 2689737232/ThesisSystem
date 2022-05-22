import { Fragment, Component } from 'react'
import { ListCompProps } from './ListComp';
import ListItem from './ListItem';

export default class ListBody extends Component<ListCompProps> {
   render() {
      return (
         <tbody className='tbody-list'>
            {this.props.pdfs.map(item => <ListItem key={item.id} id={item.id} file={item.file} />)}
         </tbody>
      )
   }
}
