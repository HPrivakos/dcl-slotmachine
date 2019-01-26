export class Slot_Machine {
    core: Entity = new Entity;
    wheel_1: Entity = new Entity;
    wheel_2: Entity = new Entity;
    wheel_3: Entity = new Entity;
    spin_handle: Entity = new Entity;

    position: Vector3;

    size: number = 0.35;

    constructor(pos: Vector3){
      this.position = pos;
      this.build_shape()
      this.move()
    }

    build_shape(){
      this.core.add(new GLTFShape("models/Slot/SlotMachine.gltf"))
      this.wheel_1.add(new GLTFShape("models/Slot/Wheel_01.gltf"))
      this.wheel_2.add(new GLTFShape("models/Slot/Wheel_02.gltf"))
      this.wheel_3.add(new GLTFShape("models/Slot/Wheel_03.gltf"))
      this.spin_handle.add(new GLTFShape("models/Slot/SpinHandle.gltf"))
    }

    move(){
      this.core.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
      this.wheel_1.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
      this.wheel_2.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
      this.wheel_3.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
      this.spin_handle.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
    }

    rotate(value: number){
      this.core.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      this.wheel_1.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      this.wheel_2.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      this.wheel_3.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      this.spin_handle.get(Transform).rotation = Quaternion.Euler(0, value, 0)
    }

    show(){
      
      engine.addEntity(this.core)
      engine.addEntity(this.wheel_1)
      engine.addEntity(this.wheel_2)
      engine.addEntity(this.wheel_3)
      engine.addEntity(this.spin_handle)
    }
}