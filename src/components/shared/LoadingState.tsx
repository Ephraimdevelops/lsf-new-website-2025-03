import BrandLoading from './BrandLoading';
export default function LoadingState({className, size = 'md', text}: {className?:string;size?:'sm'|'md'|'lg';text?:string}) {return <BrandLoading className={className} compact={size==='sm'} text={text}/>;}
