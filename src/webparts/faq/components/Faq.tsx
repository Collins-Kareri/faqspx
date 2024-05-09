import * as React from 'react';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { Placeholder } from '@pnp/spfx-controls-react';

import { 
   Checkbox,
  Text,
  IStackTokens,
  ITheme,
  Stack } from 'office-ui-fabric-react';

import type { IFaqProps } from './IFaqProps';

import { FunctionComponent,useState,useEffect } from 'react';
const Faq:FunctionComponent<IFaqProps>=(props)=>{

    const[showMessage,setShowMessage]=useState<boolean>(true);
    const{semanticColors}:IReadonlyTheme=props.themeVariant as IReadonlyTheme;
   
      

  
    const fetchData=async()=>{
      const itemsPromise:any[]= props.spContext.web.lists
       .getById(props.storageList)
       .items.select("Author/ID","Author/Title","Author/Name","Title")
       .expand("Author")
       .top(1)
       .filter(
        `Author/Title eq '${props.currentUserDisplayName} and Title eq '${props.documentTitle}`
       ).get();
       if(itemsPromise.length===0)setShowMessage(true);
       
       
    };
    
    useEffect(()=>{
      if(props.storageList&&props.storageList!==""){
        fetchData();
      }
      console.log("fetch data")
    },[props, ]);
  
    const _onConfigure=()=>{
      // Context of the web part
      props.context.propertyPane.open();
    }
    function _onChange(e:React.FormEvent<HTMLElement>,isChecked:boolean){
      props.spContext.web.lists.getById(props.storageList).items.add({
        Title:props.documentTitle
      });
      setShowMessage(false);
    }
    const mainStackTokens:IStackTokens={
      childrenGap:5,
      //padding:10,
    };
    return props.configured?(
  <Stack style={{backgroundColor:semanticColors?.bodyBackground}}>
    {showMessage?(
      <Stack style={{color:semanticColors?.bodyText}}
      tokens={mainStackTokens}
      >
      <Text>{props.acknowledgementMessage}</Text>
      <Text variant="large">{props.documentTitle} </Text>
      <Checkbox 
      theme={props.themeVariant as ITheme}
      label={props.acknowledgementLabel}
      onChange={_onChange}
      />
     
      </Stack>
    ):(
      <Stack style={{color:semanticColors?.bodyText}}>
        <Text variant="large">{props.documentTitle}</Text>
        <Text>{props.readMessage}</Text>
        </Stack>
    )}
  </Stack>
    ):(
      <Placeholder
      iconName='Edit'
      iconText={"Confirgure Read Receipt"}
      description={"Please confgure the web part by choosing a list"}
      buttonLabel='Configure'
      onConfigure={_onConfigure}
      />
    )
  } 
  
  export default Faq;