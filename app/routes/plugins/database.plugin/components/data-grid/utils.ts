import { NewValueParams } from 'ag-grid-community'
import { generateColumnSchema } from '../../lib/utils'
import { webieColDef, webieColumns, webieRowData } from '../../schema/table'
import { supportedTypes } from '../table/type-selector'
import { toast } from 'sonner'

export function checkCircular(calcColumns: webieColumns) {
    const eachDependencied = calcColumns.map(column => {
        const dependencies: string[] = []
        const customLogic = column.valueGetterCustomLogic

        if (customLogic) {
            // Get string that start with row. and has space both side
            const regex = /\brow\.(\w+)\b/g
            let match
            while ((match = regex.exec(customLogic)) !== null) {
                dependencies.push(match[1])
            }
        }
        return { [column._id]: dependencies }
    })

    const dependencyGraph: { [key: string]: string[] } = {}
    eachDependencied.forEach(dep => {
        const columnId = Object.keys(dep)[0]
        dependencyGraph[columnId] = dep[columnId]
    })

    const visited: Set<string> = new Set()
    const stack: Set<string> = new Set()

    function detectCycle(columnId: string): string[] | null {
        if (!visited.has(columnId)) {
            visited.add(columnId)
            stack.add(columnId)

            const dependencies = dependencyGraph[columnId] || []
            for (const dep of dependencies) {
                if (!visited.has(dep)) {
                    const result = detectCycle(dep)
                    if (result) {
                        return result
                    }
                } else if (stack.has(dep)) {
                    // 發現循環，回傳循環依賴的路徑
                    return [dep, columnId]
                }
            }
        }
        stack.delete(columnId)
        return null
    }

    for (const columnId in dependencyGraph) {
        const cycle = detectCycle(columnId)
        if (cycle) {
            console.log(
                `Found circular dependency between ${cycle[0]} and ${cycle[1]}`
            )
            return cycle // Returns the circular dependency (columnIds)
        }
    }
}

export function generateCustomLogic(
    column: webieColDef,
    typeCalcColumns: webieColumns,
    circulatedColumns?: string[]
): Function {
    const currentColumnId = column._id
    if (circulatedColumns?.includes(currentColumnId)) {
        return () => '#CIRCULAR'
    }

    const logicStr = column.valueGetterCustomLogic
    if (!logicStr) return () => 'NA'

    try {
        let modifiedLogicStr = logicStr

        // Replace row.columnId with chain('columnId') to get the value if depended column also use valueGetter/type calc
        typeCalcColumns.forEach(columnAlsoCalc => {
            const regex = new RegExp(`row\\.${columnAlsoCalc._id}`, 'g')
            modifiedLogicStr = modifiedLogicStr.replace(
                regex,
                `chain('${columnAlsoCalc._id}')`
            )
        })

        return new Function('row', 'chain', `return ${modifiedLogicStr}`)
    } catch (error) {
        console.log('Invalid logic string:', logicStr, error)
        return () => '#ERROR'
    }
}

export function handleCellValueChanged({
    e,
    column,
}: {
    e: NewValueParams<webieRowData>
    column: webieColDef
}) {
    const updatedRowTarget = e.data
    const dynamicSchema = generateColumnSchema(column)
    const validate = dynamicSchema.safeParse(e.newValue)

    if (!validate.success) {
        console.log(
            'error:',
            validate.error.issues.map(i => i.message)
        )
        const supportedType = supportedTypes.find(
            type => type.value === column.type
        )
        toast.error(`Invalid value for ${supportedType?.label}`)
        e.node?.setDataValue(column._id, e.oldValue)
        return false
    } else {
        return updatedRowTarget
    }
}
