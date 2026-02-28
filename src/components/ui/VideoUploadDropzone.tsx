import {useDropzone} from 'react-dropzone';

interface Props {
    onDrop: (files: File[]) => void
}

export default function VideoUploadDropzone({onDrop}: Props) {
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop: (acceptedFiles) => {
            // Handle the files (e.g., upload or display previews)
            onDrop(acceptedFiles)
        },
    });

    return (
        <div
            {...getRootProps()}
            // Apply Tailwind CSS classes for styling
            className={`
        p-12 border-4 rounded-xl text-center cursor-pointer 
        ${isDragActive
                ? 'border-blue-500 bg-blue-100 text-blue-700'
                : 'border-dashed border-gray-300  text-gray-500'
            }
      `}
        >
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    );
}