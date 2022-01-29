import { Button } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
import React from 'react';
type ListItemType = {
   item: RcFile
}
function ListItem({ item }: ListItemType) {
   return (
      <tr className='bpdy-tr'>
         <td></td>
         <td></td>
         <td></td>
         <td>{item.name}</td>
         <td></td>
         <td></td>
         <td></td>
         <td>
            <Button>取消</Button>
         </td>
         <td>
            <Button type="primary">提交</Button>
         </td>
      </tr>
   );
}

export default ListItem;
