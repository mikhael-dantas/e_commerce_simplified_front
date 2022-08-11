import React from "react";


export interface ITag {
   id: string;
   name: string;
   description: string;
}
export interface IModule {
   id: string
   name: string
}
export interface IUseCase {
   id: string
   moduleId: string
   tagIds: string[]
   name: string
   completed: boolean
   neededFrsToWorkIds: string[]
   usecasesPipelineIds: string[]
}
export interface INestedUseCase {
   id: string
   moduleId: string
   tagIds: string[]
   name: string
   completed: boolean
   neededFrsToWorkIds: string[]
   parentUseCaseId: string
}
export interface IFunctionalRequirement {
   id: string
   moduleId: string
   tagIds: string[]
   name: string
   done: boolean
   frDependencies: string[]
}
export interface IUcfrLists {
   tags: ITag[]
   modules: IModule[]
   useCases: IUseCase[]
   nestedUseCases: INestedUseCase[]
   functionalRequirements: IFunctionalRequirement[]
}

const ucfrListsContext = React.createContext<IUcfrLists>(undefined)
const updateUcfrListsContext = React.createContext<React.Dispatch<React.SetStateAction<IUcfrLists>>>(undefined)

export function UcfrsProvider({children}) {
   const [ucfrLists, setUcfrLists] = React.useState<IUcfrLists>({
      tags: [],
      modules: [],
      useCases: [],
      nestedUseCases: [],
      functionalRequirements: []
   })
   return (
      <ucfrListsContext.Provider value={ucfrLists}>
      <updateUcfrListsContext.Provider value={setUcfrLists}>
         {children}
      </updateUcfrListsContext.Provider>
      </ucfrListsContext.Provider>
   )
}

export function useUcfrLists() {
   const ucfrLists = React.useContext(ucfrListsContext)
   return ucfrLists
}

export function useUpdateUcfrLists() {
   const setUcfrLists = React.useContext(updateUcfrListsContext)
   return setUcfrLists
}
