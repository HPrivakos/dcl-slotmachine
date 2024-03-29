@Component('SpinHandle')
export class SpinHandle {
    active: boolean = false
    reverse: boolean = false
    running: boolean = false
    fraction: number = 0
    speed: number = 120
    downpos: Vector3
    uppos: Vector3
    direction: Vector3 = Vector3.Backward()
}

@Component("SpinWheel")
export class SpinWheel {
    active: boolean = false;
    reverse: boolean = false;
    fraction: number = 0;
    speed: number = 120;
    direction: Vector3 = Vector3.Forward();
    stopAt: number = 999;
}

const handles = engine.getComponentGroup(SpinHandle)
const wheels = engine.getComponentGroup(SpinWheel);

export class HandleSystem implements ISystem {
  update(dt: number) {
      // iterate over the wheels in the component group
      for (let handle of handles.entities) {
          // handy shortcuts
          let spin = handle.getComponent(SpinHandle)
          let transform = handle.getComponent(Transform)
          // check state
          if (spin.active) {
            transform.rotate(spin.direction, spin.speed * dt)
            if (spin.reverse == false && transform.rotation.eulerAngles.z < 300) {
                spin.reverse = true;
                spin.speed = 200;
                spin.direction = Vector3.Forward();
              }
              if (spin.reverse == true && (transform.rotation.eulerAngles.z > 355 || transform.rotation.eulerAngles.z < 20)) {
                spin.reverse = false;
                spin.active = false;
                spin.speed = 120;
                spin.direction = Vector3.Backward();
                transform.rotation.eulerAngles = new Vector3(0,0,0)
                spin.running = false;
              }
            }
      }
  }
}

export class WheelSystem implements ISystem {

  value: number;

  constructor(){
    this.value = 999;
  }

  update(dt: number) {
      // iterate over the wheels in the component group
      for (let wheel of wheels.entities) {
          // handy shortcuts
            let spin = wheel.getComponent(SpinWheel)
            let transform = wheel.getComponent(Transform)

            if(spin.stopAt != this.value) this.value = spin.stopAt;

            // check state
            if (spin.active) {
                transform.rotate(spin.direction, spin.speed * dt);
                if(this.value.toString().length != 3){
                    if (transform.rotation.eulerAngles.z > this.value * 36 + 15
                        &&
                        transform.rotation.eulerAngles.z < this.value * 36 + 35
                    ) {
                        
                        transform.rotation.eulerAngles = new Vector3(0, 0, this.value * 36 + 10);
                        spin.active = false;
                        this.value = 999;
                    }
                }
            }
      }
  }
}

engine.addSystem(new HandleSystem())
engine.addSystem(new WheelSystem())


export class Slot_Machine {
           core: Entity = new Entity();
           wheel_1: Entity = new Entity();
           wheel_2: Entity = new Entity();
           wheel_3: Entity = new Entity();
           buttom_1: Entity = new Entity();
           buttom_2: Entity = new Entity();
           buttom_3: Entity = new Entity();
           spin_handle: Entity = new Entity();

           position: Vector3;

           newClientSeed: boolean = false;
           active: boolean = false;
           wheelsState: Array<number>;
           size: number = 0.35;

           constructor(pos: Vector3, socket: WebSocket) {
               this.position = pos;
               this.wheelsState = [0, 0, 0];
               this.build_shape();
               this.move();

               this.spin_handle.addComponent(new SpinHandle());
               this.wheel_1.addComponent(new SpinWheel());
               this.wheel_2.addComponent(new SpinWheel());
               this.wheel_3.addComponent(new SpinWheel());
               this.spin_handle.addComponent(
                   new OnClick(e => {
                       let spin = this.spin_handle.getComponent(SpinHandle);
                       if (!this.active && !spin.running) {
                           socket.send("SlotProvably");
                           spin.active = true;
                           this.active = true;
                           spin.running = true;
                       }
                       this.wheel_1.getComponent(SpinWheel).active = true;
                       this.wheel_2.getComponent(SpinWheel).active = true;
                       this.wheel_3.getComponent(SpinWheel).active = true;
                   })
               );

               this.buttom_1.addComponent(
                   new OnClick(e => {
                       this.newClientSeed = true;
                   })
               );
           }

           setWheels(values: Array<number>) {
               if (values.length !== 3) return;
               this.wheel_1.getComponent(SpinWheel).stopAt = values[0];
               this.wheel_2.getComponent(SpinWheel).stopAt = values[1];
               this.wheel_3.getComponent(SpinWheel).stopAt = values[2];
               this.active = false;
           }

           build_shape() {
               this.core.addComponent(
                   new GLTFShape("models/Slot/SlotMachine.gltf")
               );
               this.wheel_1.addComponent(new GLTFShape("models/Slot/wheel.gltf"));
               this.wheel_2.addComponent(new GLTFShape("models/Slot/wheel.gltf"));
               this.wheel_3.addComponent(new GLTFShape("models/Slot/wheel.gltf"));
               this.buttom_1.addComponent(
                   new GLTFShape("models/Slot/Buttom_01.gltf")
               );
               this.buttom_2.addComponent(
                   new GLTFShape("models/Slot/Buttom_02.gltf")
               );
               this.buttom_3.addComponent(
                   new GLTFShape("models/Slot/Buttom_03.gltf")
               );
               this.spin_handle.addComponent(
                   new GLTFShape("models/Slot/SpinHandle.gltf")
               );
           }

           move() {
               this.core.addComponent(
                   new Transform({
                       position: this.position,
                       scale: new Vector3(
                           this.size,
                           this.size,
                           this.size
                       ),
                   })
               );

               this.wheel_1.addComponent(new Transform());
               this.wheel_2.addComponent(new Transform());
               this.wheel_3.addComponent(new Transform());

               this.spin_handle.addComponent(new Transform());

               this.wheel_1.setParent(this.core);
               this.wheel_2.setParent(this.core);
               this.wheel_3.setParent(this.core);

               this.spin_handle.setParent(this.core);

               this.wheel_1
                   .getComponent(Transform)
                   .position.set(-0.13, 4.53, -0.86);
               this.wheel_2.getComponent(Transform).position.set(-0.13, 4.53, 0);
               this.wheel_3
                   .getComponent(Transform)
                   .position.set(-0.13, 4.53, 0.86);
               this.wheel_1.getComponent(
                   Transform
               ).rotation.eulerAngles = new Vector3(0, 0, 10);
               this.wheel_2.getComponent(
                   Transform
               ).rotation.eulerAngles = new Vector3(0, 0, 10);
               this.wheel_3.getComponent(
                   Transform
               ).rotation.eulerAngles = new Vector3(0, 0, 10);

               this.spin_handle
                   .getComponent(Transform)
                   .position.set(0, 4.33, 1.74);

               this.buttom_1.addComponent(
                   new Transform({
                       position: this.position,
                       scale: new Vector3(
                           this.size,
                           this.size,
                           this.size
                       ),
                   })
               );
               this.buttom_2.addComponent(
                   new Transform({
                       position: this.position,
                       scale: new Vector3(
                           this.size,
                           this.size,
                           this.size
                       ),
                   })
               );
               this.buttom_3.addComponent(
                   new Transform({
                       position: this.position,
                       scale: new Vector3(
                           this.size,
                           this.size,
                           this.size
                       ),
                   })
               );
           }

           rotate(value: number) {
               this.core.getComponent(Transform).rotation = Quaternion.Euler(
                   0,
                   value,
                   0
               );
               //this.wheel_1.getComponent(Transform).rotation = Quaternion.Euler(0, value, 0)
               //this.wheel_2.getComponent(Transform).rotation = Quaternion.Euler(0, value, 0)
               //this.wheel_3.getComponent(Transform).rotation = Quaternion.Euler(0, value, 0)
               this.buttom_1.getComponent(Transform).rotation = Quaternion.Euler(
                   0,
                   value,
                   0
               );
               this.buttom_2.getComponent(Transform).rotation = Quaternion.Euler(
                   0,
                   value,
                   0
               );
               this.buttom_3.getComponent(Transform).rotation = Quaternion.Euler(
                   0,
                   value,
                   0
               );
               //this.spin_handle.getComponent(Transform).rotation = Quaternion.Euler(0, value, 0)
           }

           show() {
               engine.addEntity(this.core);
               engine.addEntity(this.wheel_1);
               engine.addEntity(this.wheel_2);
               engine.addEntity(this.wheel_3);
               engine.addEntity(this.buttom_1);
               //engine.addEntity(this.buttom_2)
               //engine.addEntity(this.buttom_3)
               engine.addEntity(this.spin_handle);
           }
       }