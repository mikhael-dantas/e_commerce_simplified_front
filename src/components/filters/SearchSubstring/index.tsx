import React, { useEffect } from 'react';

// import { Container } from './styles';
import { useDisclosure } from '@chakra-ui/react';
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '@myContexts/AlertStackContext';
import { IFunctionalRequirement, INestedUseCase, IUseCase, useUcfrListsContext, useUpdateUcfrListsContext } from '@myContexts/UcfrsContext';
import { UcfrListsContextInterfaces } from '@myFeaturesInterfaces/UcfrListsContextInterfaces';
import FullPopup from '../../FullPopup';
import FRequirementClickable from '@myComponents/ucfrLists/fRequirements/FRequirementClickable';
import UseCaseClickable from '@myComponents/ucfrLists/useCases/UseCaseClickable';

const SearchSubstring: React.FC = () => {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()



    const [searchSubstringInput, setSearchSubstringInput] = React.useState<string>("")

    const [FRsFilteredBySubstring, setFRsFilteredBySubstring] = React.useState<IFunctionalRequirement[]>([])
    const [UCsFilteredBySubstring, setUCsFilteredBySubstring] = React.useState<IUseCase[]>([])
    const [NUCsFilteredBySubstring, setNUCsFilteredBySubstring] = React.useState<INestedUseCase[]>([])


    const searchSubstringHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchSubstringInput(e.target.value)
    }

    function performFilterAction() {
        ucfrListsInterfaces.searchSubstringAndFilter({ substring: searchSubstringInput })
        .then((result) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: "success", text: "searched" }),
                }
            ])

            
            setFRsFilteredBySubstring(result.functionalRequirements)
            setUCsFilteredBySubstring(result.useCases)
            setNUCsFilteredBySubstring(result.nestedUseCases)
        })
        .catch((err) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: "error", text: 'error - log for details' }),
                }
            ])
            console.log(err)
        })
    }

    useEffect(() => {
        if (searchSubstringInput === "") {
            setFRsFilteredBySubstring([])
            setUCsFilteredBySubstring([])
            setNUCsFilteredBySubstring([])
            return
        }

        const timeout = setTimeout(() => {
            performFilterAction()
        }, 500)

        return () => {
            clearTimeout(timeout)
        }
    }, [searchSubstringInput])

    const {isOpen, onOpen, onClose} = useDisclosure()

    return (
        <>
        <div className='search-toggle-icon
        absolute top-0 right-0 p-2 cursor-pointer
        ' onClick={onOpen}>
            <img src='https://img.icons8.com/ios/50/000000/search--v1.png' alt='search icon'/>
        </div>
        <FullPopup isOpen={isOpen} onClose={onClose}>
            <div className='search-substring-modal-container 
            h-[80vh] w-[90vw] mx-auto bg-[rgba(255,255,255,0.8)] rounded-md p-3
            shadow-[0px 0px 10px 0px rgba(0,0,0,0.75), inset 0px 0px 10px 0px rgba(0,0,0,0.75)]
            '>

                <div className='search-substring-modal w-[100%] h-[3rem] flex flex-row'>
                    <input type='text' className='w-full h-full rounded-md p-2 w-90' placeholder='Search for a substring'
                    onChange={searchSubstringHandler}
                    />
                    <div className='filters w-[3rem] h-[3rem] bg-blue-200 rounded-md p-2 ml-2'>
                        <img src='https://img.icons8.com/ios/50/000000/filter--v1.png' alt='filter icon'/>
                    </div>
                </div>


                <div className='search-substring-results overflow-y-scroll overflow-hidden h-[60vh] mt-3'> 
                    <div className='search-substring-results__functional-requirements'>
                        <h3 className='text-xl font-bold text-center'>Functional Requirements</h3>
                        <ul className='search-substring-results__functional-requirements__list'>
                            {FRsFilteredBySubstring.map((FR) => {
                                return (
                                    <li key={FR.id} className='search-substring-results__functional-requirements__list__item bg-blue-200 mt-3 p-2'>
                                        <div className='search-substring-results__functional-requirements__list__item__id text-[.8rem] font-semibold'>
                                            {FR.id}
                                        </div>
                                        <FRequirementClickable fRequirementId={FR.id} key={FR.id} />
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className='text-center p-2'>----------------------------</div>

                    <div className='search-substring-results__use-cases'>
                        <h3 className='text-xl font-bold'>Use Cases</h3>
                        <ul className='search-substring-results__use-cases__list'>
                            {UCsFilteredBySubstring.map((UC) => {
                                return (
                                    <li key={UC.id} className='search-substring-results__use-cases__list__item bg-blue-200 mt-3'>
                                        <UseCaseClickable key={UC.id} useCase={UC}>
                                            <div className='container w-full h-full flex flex-col'>
                                                <div className='search-substring-results__use-cases__list__item__id'>
                                                    {UC.id}
                                                </div>
                                                <div className='search-substring-results__use-cases__list__item__name'>
                                                    {UC.name}
                                                </div>
                                            </div>
                                        </UseCaseClickable>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className='text-center p-2'>----------------------------</div>

                    <div className='search-substring-results__nested-use-cases'>
                        <h3 className='text-xl font-bold'>Nested Use Cases</h3>
                        <ul className='search-substring-results__nested-use-cases__list'>
                            {NUCsFilteredBySubstring.map((NUC) => {
                                return (
                                    <li key={NUC.id} className='search-substring-results__nested-use-cases__list__item bg-blue-200 mt-3'>
                                        <div className='search-substring-results__nested-use-cases__list__item__id'>
                                            {NUC.id}
                                        </div>
                                        <div className='search-substring-results__nested-use-cases__list__item__description'>
                                            {NUC.name}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </FullPopup>
        </>
    )
}

export default SearchSubstring;