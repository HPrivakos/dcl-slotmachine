// custom component to handle opening and closing doors
@Component('doorState')
export class DoorState {
  closed: boolean = true
  fraction: number = 0
  closedPos: Vector3
  openPos: Vector3
  constructor(closed: Vector3, open: Vector3){
    this.closedPos = closed
    this.openPos = open
  }
}

const doors = engine.getComponentGroup(DoorState)

export class RotatorSystem implements ISystem {
 
  update(dt: number) {
    // iterate over the doors in the component group
    for (let door of doors.entities) {
      
      // get some handy shortcuts
      let state = door.get(DoorState)
      let transform = door.get(Transform)
      // check if the rotation needs to be adjusted
      if (state.closed == false && state.fraction < 1) {
        state.fraction += dt
        transform.position = Vector3.Lerp(state.closedPos, state.openPos, state.fraction)
      } else if (state.closed == true && state.fraction > 0) {
        state.fraction -= dt
        transform.position = Vector3.Lerp(state.closedPos, state.openPos, state.fraction)   
      }
    }
  }
}

// Add system to engine
engine.addSystem(new RotatorSystem())

let collideBox = new BoxShape()
collideBox.withCollisions = true
// Define fixed walls
/*
const wall_back = new Entity()
wall_back.add(new Transform({
  position: new Vector3(15, 1, 0.05), 
  scale: new Vector3(30, 6, 0.1)
}))
*/

const wall_right = new Entity()
wall_right.add(new Transform({
  position: new Vector3(20, 0, 2), 
  scale: new Vector3(36, 7, 0.1)
}))

const wall_left = new Entity()
wall_left.add(new Transform({
  position: new Vector3(20, 0, 18), 
  scale: new Vector3(36, 7, 0.1)
}))

const wall_back = new Entity()
wall_back.add(new Transform({
  position: new Vector3(38, 0, 10), 
  scale: new Vector3(0.1, 7, 16)
}))

const roof = new Entity()
roof.add(new Transform({
  position: new Vector3(20, 3.5, 10), //x,y,z
  scale: new Vector3(36, 0.1, 16)
}))

const ground = new Entity()
ground.add(new Transform({
  position: new Vector3(20, 0, 10), //x,y,z
  scale: new Vector3(40, 0.01, 20)
}))


const wall_front_L_R = new Entity()
wall_front_L_R.add(new Transform({
  position: new Vector3(2, 0, 15), 
  scale: new Vector3(0.1, 5, 6)
}))

const wall_front_R_L = new Entity()
wall_front_R_L.add(new Transform({
  position: new Vector3(2, 0, 5), 
  scale: new Vector3(0.1, 5, 6)
}))

const wall_front_up = new Entity()
wall_front_up.add(new Transform({
  position: new Vector3(2, 3, 10), 
  scale: new Vector3(0.1, 1, 16)
}))

// Add the two sides to the door
const doorL = new Entity()
doorL.add(new Transform({
  position: new Vector3(-2, 0, 6),
  scale: new Vector3(0.05, 3, 2.1)
}))

const doorR = new Entity()
doorR.add(new Transform({
  position: new Vector3(-2, 0, 8),
  scale: new Vector3(0.05, 3, 2.1)
}))

//wall_back.add(collideBox)
wall_right.add(collideBox)
wall_left.add(collideBox)
wall_back.add(collideBox)

// back door
wall_front_L_R.add(collideBox)
wall_front_R_L.add(collideBox)
wall_front_up.add(collideBox)

roof.add(collideBox)
ground.add(collideBox)

engine.addEntity(wall_right)
engine.addEntity(wall_left)
engine.addEntity(wall_back)

engine.addEntity(wall_front_up)
engine.addEntity(wall_front_L_R)
engine.addEntity(wall_front_R_L)

//engine.addEntity(ground)
engine.addEntity(roof)

doorL.add(collideBox)
doorL.add(new DoorState(new Vector3(-2, 0, 6), new Vector3(-2, 0, 4.25)))
engine.addEntity(doorL)

doorR.add(collideBox)
doorR.add(new DoorState(new Vector3(-2, 0, 8), new Vector3(-2, 0, 9.75)))
engine.addEntity(doorR)

// Define a material to color the door red
const doorMaterial = new Material()
doorMaterial.albedoColor = Color3.Red()
doorMaterial.metallic = 0.9
doorMaterial.roughness = 0.1

// Assign the material to the door
doorL.add(doorMaterial)
doorR.add(doorMaterial)

// This parent entity holds the state for both door sides
const doorParent = new Entity()
doorParent.add(new Transform({
  position: new Vector3(4, 1, 3)
}))
engine.addEntity(doorParent)

// Set the door as a child of doorPivot
doorL.setParent(doorParent)
doorR.setParent(doorParent)


// Set the click behavior for the door
doorL.add(
  new OnClick(e => {
    let parent = doorL.getParent()
    openDoor(parent)
  })
)

doorR.add(
  new OnClick(e => {
    let parent = doorR.getParent()
    openDoor(parent)
  })
)

function openDoor(parent: Entity){
  for(let id in parent.children){
    const child = parent.children[id]
    let state = child.get(DoorState)
    state.closed = !state.closed
  }   
}