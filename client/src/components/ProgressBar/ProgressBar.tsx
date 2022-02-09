import React, { useState } from 'react';
import { Progress, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


function ProgressBar() {
   const [show, setShow] = useState(false)

   return (
      <div>
          <LoadingOutlined className='loading-comp' spin /> 
      </div>
   );
}

export default ProgressBar;
